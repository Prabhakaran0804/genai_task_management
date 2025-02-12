from sqlalchemy.future import select
from sqlalchemy.orm import Session
from models import User, Task
from schemas import UserCreate, TaskCreate, TaskUpdate
from security import hash_password, verify_password

# User CRUD
async def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_user_by_username(db: Session, email: str):
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalar_one_or_none()
    return user

# Task CRUD
async def create_task(db: Session, task: TaskCreate, user_id: int):
    db_task = Task(**task.dict(), owner_id=user_id)
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def get_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return await db.execute(select(Task).filter(Task.owner_id == user_id).offset(skip).limit(limit))

async def update_task(db: Session, task_id: int, task: TaskUpdate):
    result = await db.execute(select(Task).filter(Task.id == task_id))
    db_task = result.scalar_one_or_none()
    if db_task:
        for key, value in task.dict(exclude_unset=True).items():
            setattr(db_task, key, value)
        await db.commit()
        await db.refresh(db_task)
        return db_task
    return None

async def delete_task(db: Session, task_id: int):
    result = await db.execute(select(Task).filter(Task.id == task_id))
    db_task = result.scalar_one_or_none()
    if db_task:
        await db.delete(db_task)
        await db.commit()
        return db_task
    return None
