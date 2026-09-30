from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.database.models import Base

def build_engine(url: str):
    connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
    return create_engine(url, connect_args=connect_args, pool_pre_ping=True)

db_url = settings.DATABASE_URL
try:
    engine = build_engine(db_url)
    with engine.connect() as test_conn:
        test_conn.execute(text("SELECT 1"))
except Exception as conn_err:
    print(f"[Database Connection Warning] Primary DB ({db_url}) unreachable: {conn_err}")
    print("[Database Fallback] Switching to local SQLite database: sqlite:///./ayurbase.db")
    db_url = "sqlite:///./ayurbase.db"
    engine = build_engine(db_url)

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
            if "sqlite" in db_url:
                conn.execute(text("ALTER TABLE profiles ADD COLUMN email VARCHAR(255);"))
                conn.execute(text("ALTER TABLE profiles ADD COLUMN password_hash VARCHAR(255);"))
            else:
                conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);"))
                conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);"))
        except Exception:
            pass
        
        # Migration: add assigned_to column to assessments (student assignment by doctor)
        # NOTE: profiles.id is UUID in PostgreSQL, so assigned_to must also be UUID.
        # We skip the FK REFERENCES constraint here to avoid VARCHAR/UUID type mismatch;
        # referential integrity is enforced at the application service layer.
        try:
            if "sqlite" in db_url:
                conn.execute(text("ALTER TABLE assessments ADD COLUMN assigned_to VARCHAR(36);"))
            else:
                conn.execute(text("ALTER TABLE assessments ADD COLUMN IF NOT EXISTS assigned_to UUID;"))
        except Exception:
            pass

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
