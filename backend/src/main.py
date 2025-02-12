from fastapi import FastAPI, Depends, HTTPException, status, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
import crud, models, schemas, database, security, exceptions
from database import AsyncSessionLocal, create_tables
from utils import model_to_dict
from typing import List
from transformers import pipeline

# Initialize the sentiment analysis pipeline
sentiment_analyzer = pipeline("sentiment-analysis")


app = FastAPI()

# CORS settings
origins = [
    "http://localhost:3000",  # Add the origin of your frontend (React, Angular, etc.)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Allow specific methods (POST in this case)
    allow_headers=["*"],  # Allow all headers
)

# Dependency to get the database session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session    

# JWT Token dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.on_event("startup")
async def on_startup():
    # Run the table creation during app startup
    await create_tables()
    print("Tables created successfully!")

# Register User
@app.post("/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = await crud.get_user_by_username(db, user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    result = await crud.create_user(db=db, user=user)
    return {'email':result.email, 'id':result.id}

# Login (JWT Token Generation)
@app.post("/token")
async def login_for_access_token(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = await crud.get_user_by_username(db, form_data.email)
    if not db_user or not security.verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    access_token = security.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# CRUD Operations for Task
@app.post("/tasks", response_model=schemas.TaskResponse)
async def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    payload = security.verify_token(token)
    db_user = await crud.get_user_by_username(db, payload.get("sub"))
    task = await crud.create_task(db=db, task=task, user_id=db_user.id)
    return model_to_dict(task)

@app.get("/tasks", response_model=List[schemas.TaskResponse])
async def get_tasks(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    payload = security.verify_token(token)
    db_user = await crud.get_user_by_username(db, payload.get("sub"))
    result = await crud.get_tasks(db=db, skip=0, limit=100, user_id=db_user.id)
    db_tasks = result.scalars().all()
    return [model_to_dict(task) for task in db_tasks]
    

@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
async def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    payload = security.verify_token(token)
    db_user = await crud.get_user_by_username(db, payload.get("sub"))
    task = await crud.update_task(db=db, task_id=task_id, task=task)
    return model_to_dict(task)

@app.delete("/tasks/{task_id}", response_model=schemas.TaskResponse)
async def delete_task(task_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    payload = security.verify_token(token)
    db_user = await crud.get_user_by_username(db, payload.get("sub"))
    task = await crud.delete_task(db=db, task_id=task_id)
    return model_to_dict(task)

@app.get("/insights")
async def analyze_sentiment(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    insignts = []
    payload = security.verify_token(token)
    db_user = await crud.get_user_by_username(db, payload.get("sub"))
    result = await crud.get_tasks(db=db, skip=0, limit=3, user_id=db_user.id)
    db_tasks = result.scalars().all()
    for task in db_tasks:
        result = sentiment_analyzer(task.description)
        insignts.append({"sentiment": result[0]["label"], "score": result[0]["score"]})
    return insignts
