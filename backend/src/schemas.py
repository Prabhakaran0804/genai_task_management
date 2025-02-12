from pydantic import BaseModel
from typing import List, Optional

# User schemas for login and registration
class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True

# Task schemas
class TaskBase(BaseModel):
    task: str
    description: Optional[str] = None

class TaskCreate(TaskBase):
    priority: str
    status: str

class TaskUpdate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    priority: str
    status: str
    
    class Config:
        orm_mode = True
