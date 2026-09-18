from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Profile
from app.core.dependencies import get_current_user
from app.assessments.schemas import (
    AssessmentCreateRequest, AssessmentStatusUpdateRequest, ResponseCreateRequest,
    AssessmentDetailResponse, ResponseDetailResponse
)
from app.observations.schemas import ObservationCreateRequest, ObservationResponse
from app.calculation.schemas import AssessmentResultResponse
from app.assessments.service import AssessmentService

router = APIRouter(prefix="/assessments", tags=["Assessments & Workflow"])

@router.post("", response_model=AssessmentDetailResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(
    req: AssessmentCreateRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Initiate a new Prakriti Assessment in DRAFT status."""
    return AssessmentService.create_assessment(db, req, current_user)

@router.get("/{assessment_id}", response_model=AssessmentDetailResponse)
def get_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Retrieve complete assessment details, responses, observations, and results."""
    return AssessmentService.get_assessment_by_id(db, assessment_id, current_user)

@router.patch("/{assessment_id}", response_model=AssessmentDetailResponse)
def update_assessment_status(
    assessment_id: str,
    req: AssessmentStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """
    Update assessment state following state machine rules:
    DRAFT -> IN_PROGRESS -> SUBMITTED -> REVIEWED -> FINALIZED.
    Only an authorized DOCTOR can finalize an assessment.
    Finalized assessments become READ-ONLY.
    """
    return AssessmentService.update_assessment_status(db, assessment_id, req, current_user)

@router.post("/{assessment_id}/responses", response_model=ResponseDetailResponse, status_code=status.HTTP_201_CREATED)
def submit_response(
    assessment_id: str,
    req: ResponseCreateRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Submit or update a response for a specific question in the assessment."""
    return AssessmentService.add_response(db, assessment_id, req, current_user)

@router.post("/{assessment_id}/observations", response_model=ObservationResponse, status_code=status.HTTP_201_CREATED)
def add_observation(
    assessment_id: str,
    req: ObservationCreateRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Add practitioner clinical observation notes to the assessment."""
    return AssessmentService.add_observation(db, assessment_id, req, current_user)

@router.post("/{assessment_id}/calculate", response_model=AssessmentResultResponse)
def calculate_prakriti(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Execute the deterministic Prakriti calculation engine and save Vata/Pitta/Kapha results."""
    return AssessmentService.calculate_prakriti(db, assessment_id, current_user)

@router.get("/{assessment_id}/result", response_model=AssessmentResultResponse)
def get_assessment_result(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Retrieve the stored calculation result for an assessment."""
    return AssessmentService.get_assessment_result(db, assessment_id, current_user)
