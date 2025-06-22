from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
from datetime import datetime

from database import get_db, engine
from models import Base, User, Gym, ClimbingSession
from schemas import (
    UserCreate, UserResponse, 
    GymCreate, GymResponse,
    SessionCreate, SessionResponse, TimelineSession
)
import crud

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Climbing Social Media API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Climbing Social Media API"}

@app.get("/api/timeline", response_model=List[TimelineSession])
async def get_timeline(db: Session = Depends(get_db)):
    """Get timeline of all climbing sessions with user and gym info"""
    try:
        sessions = crud.get_timeline(db)
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch timeline: {str(e)}")

@app.get("/api/gyms", response_model=List[GymResponse])
async def get_gyms(db: Session = Depends(get_db)):
    """Get all gyms"""
    try:
        gyms = crud.get_gyms(db)
        return gyms
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch gyms: {str(e)}")

@app.post("/api/gyms", response_model=GymResponse)
async def create_gym(gym: GymCreate, db: Session = Depends(get_db)):
    """Create a new gym"""
    try:
        return crud.create_gym(db, gym)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create gym: {str(e)}")

@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    try:
        return crud.create_user(db, user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

@app.post("/api/sessions", response_model=SessionResponse)
async def create_session(session: SessionCreate, db: Session = Depends(get_db)):
    """Create a new climbing session"""
    try:
        return crud.create_session(db, session)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)