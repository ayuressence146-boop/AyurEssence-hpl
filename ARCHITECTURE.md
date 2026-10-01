# AyurEssence System Architecture

Below is the complete architectural content for your project. You can use these text summaries, technical stack details, and the Mermaid.js code blocks directly in your presentations, README files, or project reports.

---

## 1. High-Level System Architecture Diagram

This diagram shows how the frontend, backend, and database communicate with each other. 

*(If you are putting this in GitHub or a Markdown file, copy the code block below exactly as is, and it will automatically render as a diagram).*

```mermaid
graph TD
    %% Define Node Colors
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef database fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;
    classDef cloud fill:#64748b,stroke:#334155,stroke-width:2px,color:#fff;

    %% Client Layer
    subgraph Client Layer
        Browser["Web Browser (Patient/Doctor/Student)"]
    end

    %% Frontend Layer
    subgraph Frontend Layer [Vercel Hosting]
        ReactApp["React.js SPA (Vite + TypeScript)"]:::frontend
        APIClient["Axios Interceptor (API Client)"]:::frontend
        Router["React Router DOM"]:::frontend
    end

    %% Backend Layer
    subgraph Backend Layer [Render Web Service]
        FastAPI["FastAPI App (Python 3.11)"]:::backend
        Auth["JWT Authentication / Role Guards"]:::backend
        Engine["Prakriti Calculation Engine"]:::backend
        ORM["SQLAlchemy ORM (psycopg2)"]:::backend
    end

    %% Database Layer
    subgraph Database Layer [Supabase Cloud]
        Postgres[(PostgreSQL Database)]:::database
        Pooler["IPv4 Connection Pooler (PgBouncer)"]:::database
    end

    %% Connections
    Browser -->|HTTPS Request| ReactApp
    ReactApp --> Router
    Router --> APIClient
    APIClient -->|JSON Payload + JWT Bearer| FastAPI
    FastAPI --> Auth
    Auth --> Engine
    Engine --> ORM
    ORM -->|TCP/IP Port 6543| Pooler
    Pooler --> Postgres
```

---

## 2. Technology Stack Overview

**Frontend (Client Side):**
* **Core:** React 18, TypeScript, Vite
* **Routing:** React Router v6
* **Styling:** Tailwind CSS, Framer Motion (for smooth micro-animations), Lucide React (Icons)
* **Network Communication:** Axios (configured with JWT interceptors for auto-attaching auth headers)
* **Hosting:** Vercel

**Backend (Server Side):**
* **Core:** FastAPI (Python 3.11)
* **Server:** Uvicorn (ASGI web server)
* **Database ORM:** SQLAlchemy 2.0 (using `psycopg2` driver)
* **Security:** JWT (JSON Web Tokens) for stateless authentication, Passlib/Bcrypt for password hashing
* **Hosting:** Render Web Services

**Database (Data Layer):**
* **Primary Database:** PostgreSQL (Hosted on Supabase)
* **Connection Routing:** Supabase IPv4 Transaction Pooler (PgBouncer)
* **Fallback Database:** Local SQLite (Automatic failover during network outages)

---

## 3. Data Flow Architecture: Prakriti Assessment

This diagram explains the specific logic flow when a patient takes an assessment and a doctor verifies it.

```mermaid
sequenceDiagram
    actor Patient
    participant Frontend as React Frontend
    participant Backend as FastAPI Backend
    participant DB as Supabase PostgreSQL
    actor Doctor

    %% Patient Flow
    Patient->>Frontend: Fills out Vata/Pitta/Kapha Questionnaire
    Frontend->>Backend: POST /api/v1/assessments (Answers)
    Backend->>Backend: Calculate initial Dosha scores
    Backend->>DB: Save Assessment (Status: 'submitted')
    DB-->>Backend: Return Assessment ID
    Backend-->>Frontend: Success (201 Created)
    
    %% Doctor Flow
    Doctor->>Frontend: Opens Dashboard
    Frontend->>Backend: GET /api/v1/assessments/pending
    Backend->>DB: Fetch submitted assessments
    DB-->>Backend: Returns Data
    Backend-->>Frontend: Display to Doctor
    Doctor->>Frontend: Adds Nadi Pariksha observations
    Frontend->>Backend: POST /api/v1/assessments/{id}/observations
    Backend->>Backend: Recalculate Final Dosha scores
    Backend->>DB: Update Assessment (Status: 'finalized')
    Backend-->>Frontend: Success (Final Report Generated)
```

---

## 4. Database Schema (ERD) Overview

Here is a conceptual view of how the database tables are linked together:

```mermaid
erDiagram
    PROFILES {
        uuid id PK
        string email
        string hashed_password
        string role "doctor, student, patient"
    }
    
    PATIENTS {
        uuid id PK
        string full_name
        int age
        string gender
        uuid created_by FK "Links to PROFILES"
    }

    ASSESSMENTS {
        uuid id PK
        uuid patient_id FK "Links to PATIENTS"
        uuid assigned_to FK "Links to PROFILES (Doctor)"
        string status "draft, submitted, finalized"
        json final_scores "Vata, Pitta, Kapha %"
    }

    QUESTIONNAIRES {
        uuid id PK
        string category "vata, pitta, kapha"
        string text
    }

    RESPONSES {
        uuid id PK
        uuid assessment_id FK
        uuid question_id FK
        int score "1 to 5"
    }

    OBSERVATIONS {
        uuid id PK
        uuid assessment_id FK
        string nadi_vata
        string nadi_pitta
        string nadi_kapha
    }

    PROFILES ||--o{ PATIENTS : "creates/manages"
    PATIENTS ||--o{ ASSESSMENTS : "takes"
    PROFILES ||--o{ ASSESSMENTS : "evaluates"
    ASSESSMENTS ||--o{ RESPONSES : "contains"
    QUESTIONNAIRES ||--o{ RESPONSES : "linked_to"
    ASSESSMENTS ||--o| OBSERVATIONS : "has"
```

### Explanation of the Architecture:
1. **Separation of Concerns:** The application uses a strict separation between the frontend (presentation layer) and the backend (business logic). This means you could theoretically build an iOS or Android app tomorrow that uses the exact same backend API without changing any Python code.
2. **Stateless Authentication:** Using JWT means the backend does not need to store active session IDs in memory. When a request comes in, the backend just verifies the cryptographical signature of the token to know who the user is.
3. **Database Fallback Protocol:** The backend is built with high availability in mind. If the external Supabase server ever goes offline or blocks connections, the FastAPI server automatically traps the error and spins up a local SQLite database file, preventing the app from crashing.
