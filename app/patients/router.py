from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Profile
from app.core.dependencies import get_current_user
from app.patients.schemas import PatientCreateRequest, PatientUpdateRequest, PatientResponse
from app.assessments.schemas import AssessmentDetailResponse
from app.patients.service import PatientService

router = APIRouter(prefix="/patients", tags=["Patient Management"])

@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    req: PatientCreateRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Create a new patient record (Doctor or Student)."""
    return PatientService.create_patient(db, req, current_user)

@router.get("", response_model=List[PatientResponse])
def list_patients(
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Retrieve list of permitted patient records based on role and ownership."""
    return PatientService.list_patients(db, current_user)

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Retrieve specific patient details by UUID."""
    return PatientService.get_patient_by_id(db, patient_id, current_user)

@router.patch("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: str,
    req: PatientUpdateRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Update patient information (Doctor or Student owner)."""
    return PatientService.update_patient(db, patient_id, req, current_user)

@router.get("/{patient_id}/assessments", response_model=List[AssessmentDetailResponse])
def get_patient_assessments(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Retrieve all assessments for a patient (sorted newest first)."""
    return PatientService.get_patient_assessments(db, patient_id, current_user)

@router.get("/{patient_id}/timeline")
def get_patient_timeline(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    """Retrieve chronological health and Prakriti assessment timeline for a patient."""
    return PatientService.get_patient_timeline(db, patient_id, current_user)

