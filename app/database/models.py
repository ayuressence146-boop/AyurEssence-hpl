import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Date, Numeric, Text, ForeignKey, Integer, UniqueConstraint, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    full_name = Column(String(150), nullable=False)
    role = Column(String(20), nullable=False)  # doctor, student, patient
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    patients = relationship("Patient", back_populates="creator", foreign_keys="Patient.created_by")
    assessments = relationship("Assessment", back_populates="conductor", foreign_keys="Assessment.conducted_by")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_by = Column(String(36), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    full_name = Column(String(150), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(30), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    creator = relationship("Profile", back_populates="patients", foreign_keys=[created_by])
    assessments = relationship("Assessment", back_populates="patient", cascade="all, delete-orphan")


class Methodology(Base):
    __tablename__ = "methodologies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    version = Column(String(30), nullable=False)
    source = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    references = relationship("MethodologyReference", back_populates="methodology", cascade="all, delete-orphan")
    questionnaires = relationship("Questionnaire", back_populates="methodology")


class MethodologyReference(Base):
    __tablename__ = "methodology_references"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    methodology_id = Column(String(36), ForeignKey("methodologies.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(300), nullable=False)
    reference_url = Column(Text, nullable=True)
    citation = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    # Relationships
    methodology = relationship("Methodology", back_populates="references")


class Questionnaire(Base):
    __tablename__ = "questionnaires"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    version = Column(String(30), nullable=False)
    methodology_id = Column(String(36), ForeignKey("methodologies.id", ondelete="RESTRICT"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_by = Column(String(36), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    methodology = relationship("Methodology", back_populates="questionnaires")
    questions = relationship("Question", back_populates="questionnaire", cascade="all, delete-orphan", order_by="Question.order_index")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    questionnaire_id = Column(String(36), ForeignKey("questionnaires.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(20), default="single")
    is_required = Column(Boolean, default=True)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    questionnaire = relationship("Questionnaire", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOption.order_index")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    option_text = Column(Text, nullable=False)
    vata_score = Column(Numeric(6, 2), default=0)
    pitta_score = Column(Numeric(6, 2), default=0)
    kapha_score = Column(Numeric(6, 2), default=0)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    # Relationships
    question = relationship("Question", back_populates="options")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    conducted_by = Column(String(36), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    questionnaire_id = Column(String(36), ForeignKey("questionnaires.id", ondelete="RESTRICT"), nullable=False)
    methodology_id = Column(String(36), ForeignKey("methodologies.id", ondelete="RESTRICT"), nullable=False)
    status = Column(String(20), default="draft")  # draft, in_progress, submitted, reviewed, finalized
    started_at = Column(DateTime(timezone=True), default=utc_now)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    finalized_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    patient = relationship("Patient", back_populates="assessments")
    conductor = relationship("Profile", back_populates="assessments")
    questionnaire = relationship("Questionnaire")
    methodology = relationship("Methodology")
    responses = relationship("Response", back_populates="assessment", cascade="all, delete-orphan")
    observations = relationship("Observation", back_populates="assessment", cascade="all, delete-orphan")
    results = relationship("AssessmentResult", back_populates="assessment", cascade="all, delete-orphan")


class Response(Base):
    __tablename__ = "responses"
    __table_args__ = (UniqueConstraint("assessment_id", "question_id", name="unique_assessment_question"),)

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="RESTRICT"), nullable=False)
    selected_option_id = Column(String(36), ForeignKey("question_options.id", ondelete="RESTRICT"), nullable=True)
    text_answer = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    assessment = relationship("Assessment", back_populates="responses")
    question = relationship("Question")
    selected_option = relationship("QuestionOption")


class Observation(Base):
    __tablename__ = "observations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    created_by = Column(String(36), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    notes = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    assessment = relationship("Assessment", back_populates="observations")
    creator = relationship("Profile")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    vata_percentage = Column(Numeric(5, 2), nullable=False)
    pitta_percentage = Column(Numeric(5, 2), nullable=False)
    kapha_percentage = Column(Numeric(5, 2), nullable=False)
    dominant_dosha = Column(String(20), nullable=False)
    calculation_version = Column(String(30), nullable=False)
    calculated_at = Column(DateTime(timezone=True), default=utc_now)

    # Relationships
    assessment = relationship("Assessment", back_populates="results")


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    report_type = Column(String(20), nullable=False)
    report_data = Column(JSON, default=dict)
    generated_by = Column(String(36), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    generated_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
