import pytest
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.database.connection import get_db
from app.database.models import (
    Base, Profile, Patient, Methodology, MethodologyReference, Questionnaire, Question, QuestionOption
)
from app.auth.service import AUTH_USER_CREDENTIALS
from app.core.security import get_password_hash, create_access_token

from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    
    # Clear auth store for clean state
    AUTH_USER_CREDENTIALS.clear()

    # Seed Doctor
    doc_id = "00000000-0000-0000-0000-000000000001"
    doc_profile = Profile(id=doc_id, full_name="Dr. Test Doctor", role="doctor", phone="+1111111111", is_active=True)
    session.add(doc_profile)
    AUTH_USER_CREDENTIALS["doctor@test.com"] = {
        "id": doc_id,
        "email": "doctor@test.com",
        "password_hash": get_password_hash("doctor123"),
        "role": "doctor"
    }

    # Seed Student
    stu_id = "00000000-0000-0000-0000-000000000002"
    stu_profile = Profile(id=stu_id, full_name="Student Intern", role="student", phone="+2222222222", is_active=True)
    session.add(stu_profile)
    AUTH_USER_CREDENTIALS["student@test.com"] = {
        "id": stu_id,
        "email": "student@test.com",
        "password_hash": get_password_hash("student123"),
        "role": "student"
    }

    # Seed Patient Profile & Patient record
    pat_id = "00000000-0000-0000-0000-000000000003"
    pat_profile = Profile(id=pat_id, full_name="Test Patient User", role="patient", phone="+3333333333", is_active=True)
    session.add(pat_profile)
    AUTH_USER_CREDENTIALS["patient@test.com"] = {
        "id": pat_id,
        "email": "patient@test.com",
        "password_hash": get_password_hash("patient123"),
        "role": "patient"
    }

    patient_rec = Patient(
        id=pat_id,
        created_by=doc_id,
        full_name="Test Patient User",
        email="patient@test.com",
        phone="+3333333333",
        is_active=True
    )
    session.add(patient_rec)

    # Seed Methodology
    meth_id = "11111111-1111-1111-1111-111111111111"
    meth = Methodology(
        id=meth_id,
        name="Charaka Samhita Methodology",
        description="Standard classical framework",
        version="1.0.0",
        source="Charaka Samhita",
        is_active=True
    )
    session.add(meth)

    # Seed Questionnaire
    q_id = "33333333-3333-3333-3333-333333333333"
    questionnaire = Questionnaire(
        id=q_id,
        name="Test Prakriti Questionnaire",
        description="Standard Test Questionnaire",
        version="1.0.0",
        methodology_id=meth_id,
        is_active=True,
        created_by=doc_id
    )
    session.add(questionnaire)

    # Seed 2 Required Questions & Options
    q1_id = "44444444-4444-4444-4444-444444440001"
    q1 = Question(
        id=q1_id,
        questionnaire_id=q_id,
        question_text="Body Frame",
        question_type="single",
        is_required=True,
        order_index=1
    )
    session.add(q1)

    opt1_1 = QuestionOption(
        id="55555555-5555-5555-5555-555555550101",
        question_id=q1_id,
        option_text="Slim / Thin",
        vata_score=1.0,
        pitta_score=0.0,
        kapha_score=0.0,
        order_index=1
    )
    opt1_2 = QuestionOption(
        id="55555555-5555-5555-5555-555555550102",
        question_id=q1_id,
        option_text="Medium Build",
        vata_score=0.0,
        pitta_score=1.0,
        kapha_score=0.0,
        order_index=2
    )
    session.add_all([opt1_1, opt1_2])

    q2_id = "44444444-4444-4444-4444-444444440002"
    q2 = Question(
        id=q2_id,
        questionnaire_id=q_id,
        question_text="Appetite Pattern",
        question_type="single",
        is_required=True,
        order_index=2
    )
    session.add(q2)

    opt2_1 = QuestionOption(
        id="55555555-5555-5555-5555-555555550201",
        question_id=q2_id,
        option_text="Irregular Appetite",
        vata_score=1.0,
        pitta_score=0.0,
        kapha_score=0.0,
        order_index=1
    )
    opt2_2 = QuestionOption(
        id="55555555-5555-5555-5555-555555550202",
        question_id=q2_id,
        option_text="Strong Hunger",
        vata_score=0.0,
        pitta_score=1.0,
        kapha_score=0.0,
        order_index=2
    )
    session.add_all([opt2_1, opt2_2])

    session.commit()

    yield session

    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def doctor_headers():
    token = create_access_token(data={
        "sub": "00000000-0000-0000-0000-000000000001",
        "role": "doctor",
        "email": "doctor@test.com",
        "name": "Dr. Test Doctor"
    })
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def student_headers():
    token = create_access_token(data={
        "sub": "00000000-0000-0000-0000-000000000002",
        "role": "student",
        "email": "student@test.com",
        "name": "Student Intern"
    })
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def patient_headers():
    token = create_access_token(data={
        "sub": "00000000-0000-0000-0000-000000000003",
        "role": "patient",
        "email": "patient@test.com",
        "name": "Test Patient User"
    })
    return {"Authorization": f"Bearer {token}"}
