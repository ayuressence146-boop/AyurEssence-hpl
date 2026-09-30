from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.database.models import Base

# Database engine initialization
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    with engine.begin() as conn:
        from sqlalchemy import text
        try:
            conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);"))
            conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);"))
        except Exception as e:
            print("Note on column migration:", e)
