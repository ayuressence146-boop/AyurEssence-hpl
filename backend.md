# AyurEssence Backend Implementation Specification

## Project

AyurEssence — An Intelligent Ayurvedic Prakriti Assessment Platform

## HPL 2026 — Evaluation 2 Backend Implementation
# IMPORTANT SCOPE — EVALUATION 2

This task is BACKEND IMPLEMENTATION ONLY.

DO NOT create:
- React frontend
- Flutter application
- HTML/CSS frontend
- frontend components
- frontend routing
- frontend state management
- frontend API client UI
- dashboards or user interfaces

The frontend will be implemented in a later stage.

For this evaluation, implement only the backend, database,
authentication, authorization, APIs, business logic, calculation
engine, testing, and backend documentation described in this file.

The backend must be independently testable through FastAPI Swagger UI
at /docs.
---

# 1. Objective

Implement the backend defined in the HPL 2026 Week 1 Backend Technical Design document.

The objective for Evaluation 2 is to convert the documented backend architecture into a working implementation.

The implementation must provide a functional backend vertical slice:

Authentication
→ RBAC
→ Patient Management
→ Questionnaire
→ Assessment
→ Responses
→ Practitioner Observation
→ Prakriti Calculation
→ Result

The backend must be implemented as a modular monolith.

---

# 2. Technology Stack

## Backend

- Python 3.11+
- FastAPI
- Pydantic
- Uvicorn

## Database

- Supabase PostgreSQL

## Authentication

- Supabase Auth
- JWT

## Database Access

Use PostgreSQL through a clean database/service layer.

Recommended:
- SQLAlchemy
- psycopg / asyncpg

Supabase service credentials must only exist on the backend.

## Testing

- pytest
- FastAPI TestClient/httpx

## API Documentation

FastAPI automatic OpenAPI documentation.

Required:

GET /docs
GET /redoc

---

# 3. Architecture

Use a modular monolith.

All modules run inside one FastAPI application.

Modules:

- auth
- patients
- questionnaires
- assessments
- observations
- calculation
- database
- core/security

Do not create microservices.

Do not introduce Redis, Kafka, Celery, RabbitMQ or a background worker unless explicitly required later.

---

# 4. Required Project Structure

backend/
│
├── app/
│   ├── main.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── dependencies.py
│   │
│   ├── auth/
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── service.py
│   │
│   ├── patients/
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── service.py
│   │
│   ├── questionnaires/
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── service.py
│   │
│   ├── assessments/
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── service.py
│   │
│   ├── observations/
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── service.py
│   │
│   ├── calculation/
│   │   ├── engine.py
│   │   ├── schemas.py
│   │   └── service.py
│   │
│   └── database/
│       ├── connection.py
│       └── models.py
│
├── tests/
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
│
├── .env.example
├── .gitignore
├── requirements.txt
├── README.md
└── backend.md

---

# 5. Environment Variables

Create `.env.example`.

Required variables:

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

Never commit actual secrets.

Never expose the Supabase service-role key to frontend/client code.

---

# 6. Database Schema

Implement the following tables.

## profiles

- id UUID PRIMARY KEY
- full_name VARCHAR(150) NOT NULL
- role VARCHAR(20) NOT NULL
- phone VARCHAR(20)
- is_active BOOLEAN DEFAULT TRUE
- created_at TIMESTAMPTZ DEFAULT NOW()
- updated_at TIMESTAMPTZ DEFAULT NOW()

The id must reference auth.users.id.

Allowed roles:

- doctor
- student
- patient

Do not store password hashes in this table.

---

## patients

- id UUID PRIMARY KEY
- created_by UUID REFERENCES profiles(id)
- full_name VARCHAR(150) NOT NULL
- date_of_birth DATE
- gender VARCHAR(30)
- phone VARCHAR(20)
- email VARCHAR(255)
- address TEXT
- is_active BOOLEAN DEFAULT TRUE
- created_at TIMESTAMPTZ DEFAULT NOW()
- updated_at TIMESTAMPTZ DEFAULT NOW()

---

## methodologies

- id UUID PRIMARY KEY
- name VARCHAR(200) NOT NULL
- description TEXT
- version VARCHAR(30) NOT NULL
- source TEXT NOT NULL
- is_active BOOLEAN DEFAULT TRUE
- created_at TIMESTAMPTZ DEFAULT NOW()
- updated_at TIMESTAMPTZ DEFAULT NOW()

The methodology must be documented and referenced.

Do not invent a medically authoritative methodology.

---

## methodology_references

Add this table for methodology traceability.

- id UUID PRIMARY KEY
- methodology_id UUID REFERENCES methodologies(id)
- title VARCHAR(300) NOT NULL
- reference_url TEXT
- citation TEXT
- description TEXT
- created_at TIMESTAMPTZ DEFAULT NOW()

---

## questionnaires

- id UUID PRIMARY KEY
- name VARCHAR(200) NOT NULL
- description TEXT
- version VARCHAR(30) NOT NULL
- methodology_id UUID REFERENCES methodologies(id)
- is_active BOOLEAN DEFAULT TRUE
- created_by UUID REFERENCES profiles(id)
- created_at TIMESTAMPTZ DEFAULT NOW()
- updated_at TIMESTAMPTZ DEFAULT NOW()

---

## questions

- id UUID PRIMARY KEY
- questionnaire_id UUID REFERENCES questionnaires(id)
- question_text TEXT NOT NULL
- question_type VARCHAR(20) DEFAULT 'single'
- is_required BOOLEAN DEFAULT TRUE
- order_index INTEGER NOT NULL
- created_at TIMESTAMPTZ DEFAULT NOW()
- updated_at TIMESTAMPTZ DEFAULT NOW()

---

## question_options

- id UUID PRIMARY KEY
- question_id UUID REFERENCES questions(id)
- option_text TEXT NOT NULL
- vata_score NUMERIC(6,2) DEFAULT 0
- pitta_score NUMERIC(6,2) DEFAULT 0
- kapha_score NUMERIC(6,2) DEFAULT 0
- order_index INTEGER NOT NULL
- created_at TIMESTAMPTZ DEFAULT NOW()

The score values must represent the selected documented methodology.

Do not claim that arbitrary demo values are clinically validated.

---

## assessments

- id UUID PRIMARY KEY
- patient_id UUID REFERENCES patients(id)
- conducted_by UUID REFERENCES profiles(id)
- questionnaire_id UUID REFERENCES questionnaires(id)
- methodology_id UUID REFERENCES methodologies(id)
- status VARCHAR(20) DEFAULT 'draft'
- started_at TIMESTAMPTZ DEFAULT NOW()
- submitted_at TIMESTAMPTZ
- finalized_at TIMESTAMPTZ
- created_at TIMESTAMPTZ DEFAULT NOW()
- updated_at TIMESTAMPTZ DEFAULT NOW()

Allowed statuses:

- draft
- in_progress
- submitted
- reviewed
- finalized

---

## responses

- id UUID PRIMARY KEY
- assessment_id UUID REFERENCES assessments(id)
- question_id UUID REFERENCES questions(id)
- selected_option_id UUID REFERENCES question_options(id)
- text_answer TEXT
- created_at TIMESTAMPTZ DEFAULT NOW()
- updated_at TIMESTAMPTZ DEFAULT NOW()

---

## observations

- id UUID PRIMARY KEY
- assessment_id UUID REFERENCES assessments(id)
- created_by UUID REFERENCES profiles(id)
- notes TEXT NOT NULL
- created_at TIMESTAMPTZ DEFAULT NOW()
- updated_at TIMESTAMPTZ DEFAULT NOW()

---

## assessment_results

- id UUID PRIMARY KEY
- assessment_id UUID REFERENCES assessments(id)
- vata_percentage NUMERIC(5,2) NOT NULL
- pitta_percentage NUMERIC(5,2) NOT NULL
- kapha_percentage NUMERIC(5,2) NOT NULL
- dominant_dosha VARCHAR(20) NOT NULL
- calculation_version VARCHAR(30) NOT NULL
- calculated_at TIMESTAMPTZ DEFAULT NOW()

---

## reports

Create the table for future report functionality, but PDF generation is not required for Evaluation 2.

- id UUID PRIMARY KEY
- assessment_id UUID REFERENCES assessments(id)
- report_type VARCHAR(20) NOT NULL
- report_data JSONB DEFAULT '{}'
- generated_by UUID REFERENCES profiles(id)
- generated_at TIMESTAMPTZ DEFAULT NOW()
- updated_at TIMESTAMPTZ DEFAULT NOW()

---

# 7. Authentication

Use Supabase Auth.

Implement:

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Registration must:

1. Create user in Supabase Auth.
2. Create corresponding profile.
3. Assign allowed role.
4. Return safe user/profile information.

Do not return passwords.

Login must:

1. Authenticate using Supabase Auth.
2. Return access token/session information.
3. Allow subsequent protected API requests.

Protected endpoints require a valid JWT.

---

# 8. Authorization

Implement RBAC.

Roles:

DOCTOR
STUDENT
PATIENT

Rules:

Doctor:
- create patients
- view patients
- update patients
- create assessments
- add observations
- calculate results
- finalize assessments
- view full practitioner reports

Student:
- create patients
- view permitted patients
- update permitted patients
- create assessments
- add observations
- calculate results
- cannot finalize assessments

Patient:
- access only their own permitted patient information
- submit permitted responses
- view their own results
- view simplified patient information

Resource ownership must also be checked.

Checking only the role is not sufficient.

---

# 9. Patient APIs

Implement:

POST /api/patients
GET /api/patients
GET /api/patients/{patient_id}
PATCH /api/patients/{patient_id}

Validation:

- full_name required
- valid UUIDs
- authorized role required
- resource access checked

---

# 10. Questionnaire APIs

Implement:

GET /api/questionnaires
GET /api/questionnaires/{questionnaire_id}

Only active questionnaires should be returned for normal assessment creation.

Questionnaire response should include:

- questionnaire metadata
- methodology
- ordered questions
- question type
- required flag
- ordered options

---

# 11. Assessment APIs

Implement:

POST /api/assessments
GET /api/assessments/{assessment_id}
PATCH /api/assessments/{assessment_id}

Assessment creation requires:

patient_id
questionnaire_id
methodology_id

Validation:

- patient exists
- questionnaire exists
- methodology exists
- questionnaire is active
- methodology is active
- user has access to patient
- user has permission to create assessment

Initial status:

draft

---

# 12. Assessment State Machine

Valid transitions:

DRAFT → IN_PROGRESS

IN_PROGRESS → SUBMITTED

SUBMITTED → REVIEWED

REVIEWED → FINALIZED

FINALIZED → READ_ONLY

Invalid transitions must return:

409 Conflict

Finalized assessments cannot be modified through normal assessment APIs.

Only a doctor can finalize an assessment.

---

# 13. Response API

Implement:

POST /api/assessments/{assessment_id}/responses

Before storing a response:

1. Verify assessment exists.
2. Verify user can access assessment.
3. Verify assessment is not finalized.
4. Verify question exists.
5. Verify question belongs to the assessment questionnaire.
6. Verify selected option belongs to the question.
7. Validate response type.
8. Save response.

Required questions must be answered before submission.

---

# 14. Observation API

Implement:

POST /api/assessments/{assessment_id}/observations

Allowed:

- doctor
- student

Store:

- assessment_id
- created_by
- notes
- timestamps

Do not automatically convert free-form observation text into numerical Dosha scores.

---

# 15. Prakriti Calculation Engine

Implement:

POST /api/assessments/{assessment_id}/calculate

The calculation engine must be deterministic.

It must:

1. Load assessment.
2. Load questionnaire.
3. Load responses.
4. Validate required responses.
5. Load selected options.
6. Read methodology-specific scoring values.
7. Calculate Vata contribution.
8. Calculate Pitta contribution.
9. Calculate Kapha contribution.
10. Normalize according to the configured methodology.
11. Determine dominant Dosha.
12. Validate final percentages.
13. Store result.
14. Store calculation version.
15. Return result.

The engine must NOT use an LLM to decide the final Dosha.

AI/NLP can be added later as an assistive feature.

---

# 16. Calculation Result Validation

The final result must satisfy:

vata_percentage >= 0
pitta_percentage >= 0
kapha_percentage >= 0

and:

vata_percentage + pitta_percentage + kapha_percentage = 100

within the defined numerical tolerance.

Dominant Dosha must be one of:

- Vata
- Pitta
- Kapha

Store:

- methodology/version
- calculation version
- calculation timestamp

---

# 17. Result API

Implement:

GET /api/assessments/{assessment_id}/result

Return:

- assessment_id
- Vata percentage
- Pitta percentage
- Kapha percentage
- dominant Dosha
- calculation version
- calculation timestamp

Patient access must be restricted to their own assessment.

---

# 18. Reports

For Evaluation 2:

Do not implement PDF generation.

Keep report database structure ready.

A future implementation may provide:

GET /api/assessments/{assessment_id}/report

with:

doctor_full

and

patient_summary

report types.

---

# 19. History

Patient history is a later-stage feature.

Do not make history a blocker for Evaluation 2.

Future API:

GET /api/patients/{patient_id}/history

---

# 20. Security

Implement:

- JWT authentication
- RBAC
- resource-level authorization
- Pydantic validation
- environment-based secrets
- HTTPS-ready configuration
- safe error responses
- no password storage in application database
- no service-role key exposure
- database foreign keys
- audit timestamps

Do not expose internal stack traces to API clients.

---

# 21. Error Format

Use:

{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource does not exist"
  }
}

Use HTTP status codes:

400 — invalid input
401 — unauthenticated
403 — unauthorized
404 — not found
409 — conflict / invalid state
500 — unexpected server error

---

# 22. Database Migration

Create:

supabase/migrations/001_initial_schema.sql

The migration must create:

- profiles
- patients
- methodologies
- methodology_references
- questionnaires
- questions
- question_options
- assessments
- responses
- observations
- assessment_results
- reports

Add:

- primary keys
- foreign keys
- NOT NULL constraints
- useful indexes
- appropriate unique constraints
- status/check constraints where appropriate

---

# 23. Seed Data

Create:

supabase/seed.sql

Seed:

1. One methodology record.
2. One methodology reference.
3. One questionnaire.
4. Several questions.
5. Multiple options per question.
6. Methodology-specific scoring values.

IMPORTANT:

If the final validated Ayurvedic methodology has not yet been approved by the team, clearly label seeded scoring data as demonstration/test data.

Do not present test scoring as medically validated.

---

# 24. Testing

Use pytest.

Required tests:

## Authentication

- valid login
- invalid login
- missing JWT
- invalid JWT

## RBAC

- patient cannot create assessment
- student cannot finalize
- doctor can finalize
- unauthorized user cannot access another patient's data

## Patients

- create patient
- retrieve patient
- update patient
- invalid patient ID

## Questionnaire

- retrieve active questionnaire
- questionnaire contains ordered questions/options

## Assessment

- create assessment
- invalid patient
- invalid questionnaire
- invalid methodology
- valid state transition
- invalid state transition

## Responses

- valid response
- missing required response
- question from another questionnaire
- invalid option

## Calculation

- calculation executes
- result contains Vata/Pitta/Kapha
- percentages normalize correctly
- dominant Dosha is returned
- calculation version is stored

## Finalization

- doctor can finalize
- student cannot finalize
- finalized assessment cannot be modified

---

# 25. API Documentation

FastAPI Swagger documentation must work.

Verify:

http://localhost:8000/docs

The evaluator should be able to test the backend APIs from Swagger UI.

---

# 26. Health Check

Implement:

GET /health

Response:

{
  "status": "ok",
  "service": "ayurEssence-backend"
}

---

# 27. README Requirements

README.md must contain:

1. Project overview
2. Architecture
3. Technology stack
4. Project structure
5. Supabase setup
6. Environment variables
7. Database migration
8. Seed instructions
9. Installation
10. Running the server
11. API documentation
12. Testing
13. Implemented features
14. Features planned for next stage
15. Known limitations
16. Evaluation 2 YouTube video link

---

# 28. Installation

The backend must be runnable using a simple process.

Example:

python -m venv .venv

Activate virtual environment.

pip install -r requirements.txt

Create .env from .env.example.

Run:

uvicorn app.main:app --reload

---

# 29. Definition of Done

Evaluation 2 backend is considered complete when:

[ ] Supabase project configured

[ ] PostgreSQL schema created

[ ] Database migration committed

[ ] Seed data committed

[ ] FastAPI server runs successfully

[ ] /health works

[ ] Swagger /docs works

[ ] Supabase authentication works

[ ] JWT authentication works

[ ] Profiles are created

[ ] RBAC works

[ ] Patient CRUD works

[ ] Questionnaire API works

[ ] Assessment creation works

[ ] Assessment state transitions work

[ ] Responses are stored and validated

[ ] Practitioner observations are stored

[ ] Prakriti calculation works using configured methodology

[ ] Assessment result is stored

[ ] Finalization works for doctor

[ ] Finalized assessment becomes read-only

[ ] Error handling works

[ ] Automated tests pass

[ ] README is complete

[ ] No secrets are committed

[ ] GitHub repository is clean and runnable

---

# 30. Evaluation 2 Demonstration Flow

The backend demonstration should show one complete working assessment.

Demo sequence:

1. Open Swagger UI.
2. Register/login.
3. Show authenticated user.
4. Create patient.
5. Retrieve patient.
6. Retrieve questionnaire.
7. Create assessment.
8. Show assessment status.
9. Submit responses.
10. Add practitioner observation.
11. Run calculation.
12. Show Vata/Pitta/Kapha result.
13. Show calculation version.
14. Finalize assessment using doctor.
15. Attempt modification after finalization.
16. Show rejection.

The demonstration should focus on functionality actually implemented.

---

# 31. Evaluation 2 Scope

Implemented now:

- Database architecture
- Supabase setup
- Authentication
- RBAC
- Patient management
- Questionnaire
- Assessment management
- Response management
- Practitioner observations
- Prakriti calculation
- Result storage
- Assessment finalization
- API documentation
- Testing

Deferred:

- PDF reports
- Advanced history
- NLP
- Adaptive questionnaire
- Regional languages
- Analytics
- Frontend
- Advanced notifications

---

# 32. Important Development Rule

Do not implement functionality merely to make the architecture document appear complete.

The GitHub implementation is the source of truth for Evaluation 2.

If implementation differs from the Week 1 architecture:

1. Document the change.
2. Explain why the change was made.
3. Update the Week 1 document.
4. Mention the change in the Evaluation 2 video.

The objective is to demonstrate the relationship:

PLAN
→ IMPLEMENTATION
→ VALIDATION
→ ITERATION

---

# 33. Final Backend Flow

The completed Evaluation 2 backend must demonstrate:

User
↓
Supabase Auth
↓
JWT
↓
FastAPI
↓
RBAC
↓
Patient
↓
Assessment
↓
Questionnaire
↓
Responses
↓
Practitioner Observation
↓
Deterministic Prakriti Calculation
↓
Assessment Result
↓
Doctor Finalization
↓
Read-only Assessment