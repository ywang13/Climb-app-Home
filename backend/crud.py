from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from models import User, Gym, ClimbingSession
from schemas import UserCreate, GymCreate, SessionCreate, TimelineSession, UserInTimeline, GymInTimeline

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        username=user.username,
        password=user.password,
        profile_picture=user.profile_picture
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_gyms(db: Session):
    return db.query(Gym).all()

def create_gym(db: Session, gym: GymCreate):
    db_gym = Gym(name=gym.name, location=gym.location)
    db.add(db_gym)
    db.commit()
    db.refresh(db_gym)
    return db_gym

def create_session(db: Session, session: SessionCreate):
    db_session = ClimbingSession(
        user_id=session.user_id,
        gym_id=session.gym_id,
        title=session.title,
        description=session.description,
        total_send=session.total_send,
        routes_climbed=session.routes_climbed,
        duration_minutes=session.duration_minutes
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_timeline(db: Session) -> List[TimelineSession]:
    # Query sessions with joined user and gym data
    sessions = db.query(ClimbingSession).join(User).join(Gym).order_by(desc(ClimbingSession.created_at)).all()
    
    # Convert to timeline format
    timeline_sessions = []
    for session in sessions:
        timeline_session = TimelineSession(
            id=session.id,
            title=session.title,
            description=session.description,
            total_send=session.total_send,
            routes_climbed=session.routes_climbed,
            duration_minutes=session.duration_minutes,
            created_at=session.created_at,
            user=UserInTimeline(
                id=session.user.id,
                username=session.user.username,
                profile_picture=session.user.profile_picture
            ),
            gym=GymInTimeline(
                id=session.gym.id,
                name=session.gym.name,
                location=session.gym.location
            )
        )
        timeline_sessions.append(timeline_session)
    
    return timeline_sessions

def seed_data(db: Session):
    """Seed the database with sample data"""
    # Check if data already exists
    if db.query(User).first():
        return
    
    # Create sample gyms
    gyms = [
        Gym(name="Movement Santa Clara", location="Santa Clara"),
        Gym(name="Movement Sunnyvale", location="Sunnyvale"), 
        Gym(name="Movement Berkeley", location="Berkeley")
    ]
    
    for gym in gyms:
        db.add(gym)
    db.commit()
    
    # Create sample users
    users = [
        User(
            username="alex_climber",
            password="password",
            profile_picture="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        ),
        User(
            username="sarah_sends", 
            password="password",
            profile_picture="https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100&h=100&fit=crop&crop=face"
        ),
        User(
            username="mike_boulder",
            password="password", 
            profile_picture="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
        )
    ]
    
    for user in users:
        db.add(user)
    db.commit()
    
    # Create sample sessions
    sessions = [
        ClimbingSession(
            user_id=1, gym_id=1,
            title="Great bouldering session!",
            description="Worked on some V4s and finally sent that crimpy overhang problem",
            total_send=8, routes_climbed=12, duration_minutes=116
        ),
        ClimbingSession(
            user_id=2, gym_id=2,
            title="Top rope training", 
            description="Focused on endurance routes and technique work",
            total_send=6, routes_climbed=8, duration_minutes=90
        ),
        ClimbingSession(
            user_id=3, gym_id=1,
            title="Quick lunch session",
            description="Short but productive boulder session", 
            total_send=4, routes_climbed=6, duration_minutes=45
        )
    ]
    
    for session in sessions:
        db.add(session)
    db.commit()