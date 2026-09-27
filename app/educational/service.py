import uuid
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database.models import MentorFeedback, Assessment, AssessmentResult, Observation, Profile
from app.educational.schemas import MentorFeedbackCreateRequest, StudentAnalyticsResponse, InterpretationComparisonResponse
from app.core.exceptions import NotFoundException, UnauthorizedException, BadRequestException

class EducationalService:

    @staticmethod
    def add_mentor_feedback(db: Session, req: MentorFeedbackCreateRequest, current_user: Profile) -> MentorFeedback:
        if current_user.role != "doctor":
            raise UnauthorizedException("Only a qualified DOCTOR can leave educational mentor feedback")

        fb = MentorFeedback(
            id=str(uuid.uuid4()),
            assessment_id=str(req.assessment_id),
            student_id=str(req.student_id),
            doctor_id=str(current_user.id),
            feedback_type=req.feedback_type,
            notes=req.notes
        )
        db.add(fb)
        db.commit()
        db.refresh(fb)
        return fb

    @staticmethod
    def compare_student_vs_doctor_result(db: Session, assessment_id: str) -> InterpretationComparisonResponse:
        assessment = db.query(Assessment).filter(Assessment.id == str(assessment_id)).first()
        if not assessment:
            raise NotFoundException(f"Assessment '{assessment_id}' not found")

        student_obs = []
        doctor_obs = []

        for obs in assessment.observations:
            if obs.creator and obs.creator.role == "student":
                student_obs.append(obs.notes)
            else:
                doctor_obs.append(obs.notes)

        result = assessment.results[0] if assessment.results else None

        return InterpretationComparisonResponse(
            assessment_id=str(assessment.id),
            status=assessment.status,
            student_notes=student_obs,
            doctor_notes=doctor_obs,
            student_calculated_dosha=result.dominant_dosha if result else None,
            finalized_dominant_dosha=result.dominant_dosha if result and assessment.status == "finalized" else "Pending Finalization"
        )

    @staticmethod
    def get_student_analytics(db: Session, student_id: str) -> StudentAnalyticsResponse:
        student = db.query(Profile).filter(Profile.id == str(student_id), Profile.role == "student").first()
        if not student:
            raise NotFoundException(f"Student with ID '{student_id}' not found")

        conducted = db.query(Assessment).filter(Assessment.conducted_by == str(student_id)).all()
        total_count = len(conducted)
        reviewed_count = sum(1 for a in conducted if a.status in ["reviewed", "finalized"])
        pending_count = sum(1 for a in conducted if a.status in ["draft", "in_progress", "submitted"])

        feedback_count = db.query(MentorFeedback).filter(MentorFeedback.student_id == str(student_id)).count()

        return StudentAnalyticsResponse(
            student_id=str(student.id),
            student_name=student.full_name,
            assessments_conducted=total_count,
            doctor_reviewed_count=reviewed_count,
            pending_review_count=pending_count,
            feedback_received_count=feedback_count
        )
