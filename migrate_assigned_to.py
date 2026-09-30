from app.database.connection import engine
from sqlalchemy import text

with engine.connect() as conn:
    # Check if assigned_to column exists
    result = conn.execute(text(
        "SELECT column_name FROM information_schema.columns "
        "WHERE table_name='assessments' AND column_name='assigned_to'"
    ))
    rows = result.fetchall()
    if rows:
        print("Column 'assigned_to' already EXISTS in assessments table.")
    else:
        print("Column 'assigned_to' DOES NOT EXIST - adding it now...")
        # Use UUID type to match profiles.id column type in PostgreSQL
        # No FK constraint to avoid type mismatch issues; integrity enforced at app layer
        conn.execute(text(
            "ALTER TABLE assessments "
            "ADD COLUMN IF NOT EXISTS assigned_to UUID;"
        ))
        conn.commit()
        print("SUCCESS: Column 'assigned_to' added to assessments table!")
    
    # Also check the current columns on assessments for debug
    cols = conn.execute(text(
        "SELECT column_name, data_type FROM information_schema.columns "
        "WHERE table_name='assessments' ORDER BY ordinal_position"
    )).fetchall()
    print("\nCurrent assessments columns:")
    for c in cols:
        print(f"  {c[0]:30s} {c[1]}")
