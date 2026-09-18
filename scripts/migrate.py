import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL or "localhost" in DATABASE_URL:
    print("Error: DATABASE_URL is not set or still pointing to localhost.")
    sys.exit(1)

print(f"Connecting to database: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")

engine = create_engine(DATABASE_URL)

def run_sql_file(filepath):
    print(f"Applying {filepath}...")
    with open(filepath, "r", encoding="utf-8") as f:
        sql = f.read()
    
    with engine.begin() as conn:
        # Split statements by semicolon where appropriate or execute raw SQL batch
        conn.execute(text(sql))
    print(f"Successfully applied {filepath}")

if __name__ == "__main__":
    try:
        run_sql_file("supabase/migrations/001_initial_schema.sql")
        run_sql_file("supabase/seed.sql")
        print("Database migration and seeding completed successfully!")
    except Exception as e:
        print(f"Migration error: {e}")
        sys.exit(1)
