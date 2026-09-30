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
        
        try:
            res = conn.execute(text("SELECT COUNT(*) FROM questionnaires;")).scalar()
            if res == 0:
                import os
                seed_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "supabase", "seed.sql")
                if os.path.exists(seed_file):
                    with open(seed_file, "r", encoding="utf-8") as f:
                        sql_content = f.read()
                    statements = [s.strip() for s in sql_content.split(";") if s.strip() and not s.strip().startswith("--")]
                    for stmt in statements:
                        if stmt:
                            try:
                                conn.execute(text(stmt))
                            except Exception as seed_err:
                                print("Seed statement note:", seed_err)
                    print("Successfully seeded official Ayurvedic Prakriti questions to database!")
        except Exception as err:
            print("Auto-seed check note:", err)
