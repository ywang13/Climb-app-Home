from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    profile_picture: Optional[str] = None

class UserResponse(UserBase):
    id: int
    profile_picture: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserInTimeline(BaseModel):
    id: int
    username: str
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

# Gym schemas
class GymBase(BaseModel):
    name: str
    location: str

class GymCreate(GymBase):
    pass

class GymResponse(GymBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class GymInTimeline(BaseModel):
    id: int
    name: str
    location: str

    class Config:
        from_attributes = True

# Session schemas
class SessionBase(BaseModel):
    title: str
    description: Optional[str] = None
    total_send: int = 0
    routes_climbed: int = 0
    duration_minutes: int  # duration in minutes

class SessionCreate(SessionBase):
    user_id: int
    gym_id: int

class SessionResponse(SessionBase):
    id: int
    user_id: int
    gym_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Timeline session schema (combines session with user and gym info)
class TimelineSession(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    total_send: int
    routes_climbed: int
    duration_minutes: int
    created_at: datetime
    user: UserInTimeline
    gym: GymInTimeline

    class Config:
        from_attributes = True