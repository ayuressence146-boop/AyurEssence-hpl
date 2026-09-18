import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL is not set in .env")
    sys.exit(1)

engine = create_engine(DATABASE_URL)

tables = [
    "profiles",
    "patients",
    "methodologies",
    "questionnaires",
    "questions",
    "question_options",
    "assessments",
    "responses",
    "observations",
    "assessment_results",
    "reports"
]

def print_table_data(table_name):
    print(f"\n==================== TABLE: {table_name.upper()} ====================")
    with engine.connect() as conn:
        result = conn.execute(text(f"SELECT * FROM {table_name} LIMIT 20"))
        rows = result.fetchall()
        keys = result.keys()
        
        if not rows:
            print("(No records found)")
            return
            
        print(" | ".join(keys))
        print("-" * 80)
        for row in rows:
            print(" | ".join(str(val) for val in row))

if __name__ == "__main__":
    print("Fetching stored data from Supabase PostgreSQL...")
    for t in tables:
        try:
            print_table_data(t)
        except Exception as e:
            print(f"Could not read {t}: {e}")
