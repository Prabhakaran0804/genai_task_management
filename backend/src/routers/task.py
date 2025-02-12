from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db
from security import verify_token

router = APIRouter()

@router.post("/", response_model=schemas.TaskInDB)
async def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return await crud.create_task(db=db, task=task)

@router.get("/", response_model=list[schemas.TaskInDB])
async def get_tasks(db: Session = Depends(get_db)):
    return await crud.get_tasks(db=db)

@router.get("/{task_id}", response_model=schemas.TaskInDB)
async def get_task(task_id: int, db: Session = Depends(get_db)):
    db_task = await crud.get_task(db=db, task_id=task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.put("/{task_id}", response_model=schemas.TaskInDB)
async def update_task(task_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return await crud.update_task(db=db, task_id=task_id, task=task)

@router.delete("/{task_id}")
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    return await crud.delete_task(db=db, task_id=task_id)
