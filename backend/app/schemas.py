from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from pydantic.types import conint

# Task
class TaskCreate(BaseModel):
    task: str
    priority: str
    status: str
    owner_id: int

    class config:
        from_attributes = True

class TaskResponse(TaskCreate):
    id: int 
    created_at: datetime

# udate task
class TaskUpdate(BaseModel):
    task: str
    priority: str
    status: str

    class Config:
        from_attributes = True


# User create
class UserCreate(BaseModel):
    name: str
    lastname: str
    email: EmailStr
    password: str

# User response
class UserOut(BaseModel):
    id: int
    name: str
    lastname: str
    email: EmailStr
    created_at: datetime

# Authentication
class UserLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        from_attributes = True

# token
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    id: Optional[int] = None