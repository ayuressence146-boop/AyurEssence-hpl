from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.database.models import Profile
from app.educational.schemas import MentorFeedbackCreateRequest, MentorFeedbackResponse, StudentAnalyticsResponse, InterpretationComparisonResponse
from app.educational.service import EducationalService

router = APIRouter(prefix="/api/educational", tags=["Educational Platform"])

@router.post("/feedback", response_model=MentorFeedbackResponse, status_code=status.HTTP_201_CREATED)
def leave_mentor_feedback(req: MentorFeedbackCreateRequest, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return EducationalService.add_mentor_feedback(db, req, current_user)

@router.get("/compare/{assessment_id}", response_model=InterpretationComparisonResponse)
def compare_assessment_interpretations(assessment_id: str, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return EducationalService.compare_student_vs_doctor_result(db, assessment_id)

@router.get("/analytics/{student_id}", response_model=StudentAnalyticsResponse)
def get_student_learning_analytics(student_id: str, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return EducationalService.get_student_analytics(db, student_id)
