# AyurEssence — An Intelligent Ayurvedic Prakriti Assessment Platform

## Evaluation 2 — FastAPI Production-Structured Backend Implementation

Welcome to the **AyurEssence** Evaluation 2 Backend repository. This project implements a production-structured, fully runnable modular monolith FastAPI backend designed for automated Ayurvedic Prakriti assessment, clinical observation capture, and deterministic Dosha scoring.

---

## 1. Project Overview

AyurEssence automates the classical Ayurvedic Prakriti assessment workflow derived from Charaka Samhita (Vimanasthana Chapter 8). The platform provides role-based access for **Doctors**, **Students (Interns)**, and **Patients**, enforcing patient access boundaries, assessment state transitions, deterministic scoring calculations, and read-only immutability once finalized.

---

## 2. Architecture & Design

The backend is built as a **Modular Monolith** running inside a single FastAPI application.

```
AyurEssence/
├── app/
│   ├── main.py                   # FastAPI Application Entry & Routing
│   ├── core/                     # Configuration, Security & Dependencies
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── dependencies.py
│   │   └── exceptions.py
│   ├── database/                 # SQLAlchemy ORM Models & Connection
│   │   ├── connection.py
│   │   └── models.py
│   ├── auth/                     # Supabase/JWT Auth Module
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── service.py
│   ├── patients/                 # Patient Management Module
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── service.py
│   ├── questionnaires/           # Questionnaire & Scoring Option Module
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── service.py
│   ├── assessments/              # Assessment Workflow & State Machine
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── service.py
│   ├── observations/             # Clinical Observations Module
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── service.py
│   └── calculation/              # Deterministic Prakriti Scoring Engine
│       ├── engine.py
│       ├── schemas.py
│       └── service.py
├── supabase/                     # PostgreSQL Migrations & Seed Data
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── tests/                        # Pytest Automated Test Suite
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_rbac.py
│   ├── test_patients.py
│   ├── test_questionnaires.py
│   ├── test_assessments.py
│   ├── test_responses.py
│   ├── test_calculation.py
│   └── test_finalization.py
├── .env.example                  # Environment Variables Template
├── .gitignore                    # Secrets & Temporary File Protections
├── requirements.txt              # Python Dependencies
└── README.md
```

---

## 3. Technology Stack

- **Language**: Python 3.11+
- **Framework**: FastAPI (Async-ready REST APIs)
- **Data Validation**: Pydantic V2
- **Database**: Supabase PostgreSQL (SQLAlchemy 2.0 ORM)
- **Authentication**: Supabase Auth / JWT (PyJWT, Passlib)
- **Testing**: Pytest, FastAPI TestClient, SQLite in-memory static pool
- **Documentation**: Swagger UI (`/docs`), ReDoc (`/redoc`)

---

## 4. Environment Variables Setup

Create a `.env` file in the project root based on `.env.example`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database Connection URL (PostgreSQL / Supabase)
DATABASE_URL=postgresql://postgres:password@localhost:5432/ayurbase

# JWT Security Configuration
JWT_SECRET=super-secret-jwt-key-change-me-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

> [!CAUTION]
> Never commit `.env` or service role keys to version control.

---

## 5. Database Schema & Migration

Database migrations and initial seed scripts are maintained in the `supabase/` folder:

1. **Schema Migration**: Run `supabase/migrations/001_initial_schema.sql` on your PostgreSQL / Supabase database.
2. **Seed Data**: Run `supabase/seed.sql` to populate default profiles (Doctor, Student, Patient), active Charaka Samhita methodology, sample questionnaire, and scored options.

---

## 6. Installation & Execution

### 1. Clone & Setup Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Activate virtual environment (Linux/macOS)
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run FastAPI Backend

```bash
uvicorn app.main:app --reload
```

The backend server will start at: `http://localhost:8000`

---

## 7. Interactive API Documentation (Swagger UI)

Open your browser and navigate to:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 8. Automated Testing

Run the comprehensive pytest suite:

```bash
python -m pytest -v
```

All 17 test cases test:
- Authentication & JWT Validation
- Role-Based Access Control (RBAC) & Resource Boundaries
- Patient CRUD operations
- Questionnaire retrieval
- Assessment state machine transitions (`DRAFT` → `IN_PROGRESS` → `SUBMITTED` → `REVIEWED` → `FINALIZED`)
- Required question submission checks
- Deterministic calculation engine (normalized Vata/Pitta/Kapha percentages)
- Post-finalization read-only immutability (rejection of edits with 409 Conflict)

---

## 9. Evaluation 2 Swagger UI Demonstration Flow

To demonstrate the full assessment slice:

1. **Health Check**: `GET /health` → Verify status is `"ok"`.
2. **Register Doctor**: `POST /api/auth/register` with role `"doctor"`.
3. **Login Doctor**: `POST /api/auth/login` → Copy `access_token`.
4. **Authorize Swagger**: Click **Authorize** button in Swagger UI and input `Bearer <access_token>`.
5. **Get Current Profile**: `GET /api/auth/me`.
6. **Create Patient**: `POST /api/patients` with patient details.
7. **Retrieve Patient**: `GET /api/patients/{patient_id}`.
8. **Get Questionnaire**: `GET /api/questionnaires` → Note questionnaire & option IDs.
9. **Initiate Assessment**: `POST /api/assessments` with `patient_id`, `questionnaire_id`, and `methodology_id` (Initial status: `draft`).
10. **Submit Responses**: `POST /api/assessments/{assessment_id}/responses` for questions.
11. **Add Clinical Observation**: `POST /api/assessments/{assessment_id}/observations` with practitioner notes.
12. **Calculate Prakriti**: `POST /api/assessments/{assessment_id}/calculate` → Observe Vata %, Pitta %, Kapha %, and dominant Dosha.
13. **Retrieve Results**: `GET /api/assessments/{assessment_id}/result`.
14. **Advance State**: `PATCH /api/assessments/{assessment_id}` to `submitted` then `reviewed`.
15. **Finalize Assessment**: `PATCH /api/assessments/{assessment_id}` with status `"finalized"` (Doctor only).
16. **Verify Immutability**: Attempt `POST /api/assessments/{assessment_id}/responses` → Rejection with `409 Conflict`.

---

## 10. Implemented vs. Deferred Scope

### Implemented (Evaluation 2 Scope):
- PostgreSQL Database Schema (12 tables) & Migrations
- Supabase Auth & JWT authentication
- Role-Based & Resource-Level Authorization (Doctor, Student, Patient)
- Patient CRUD management
- Questionnaire & scoring options
- Assessment state machine enforcement
- Response validation & required questions guard
- Practitioner clinical observations
- Deterministic Prakriti calculation engine
- Read-only locking upon finalization
- Automated Test Suite & Swagger documentation

### Deferred (Future Evaluation Scope):
- React / Flutter Frontend UI
- PDF Report generation
- Historical trend analytics
- NLP assistive diagnostic suggestions

---

## 11. Evaluation Video Link Placeholder

- **Demo Video**: [Link to Evaluation 2 Demonstration Video](https://youtu.be/atpccnDKf1k?feature=shared)
