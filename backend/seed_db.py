from database import SessionLocal, engine
from models import Base
from crud import seed_data

# Create tables
Base.metadata.create_all(bind=engine)

# Seed data
db = SessionLocal()
try:
    seed_data(db)
    print("Database seeded successfully!")
except Exception as e:
    print(f"Error seeding database: {e}")
finally:
    db.close()