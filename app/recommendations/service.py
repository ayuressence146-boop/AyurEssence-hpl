import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database.models import Recommendation, Assessment, AssessmentResult, Profile
from app.recommendations.schemas import RecommendationCreateRequest, RecommendationApproveRequest
from app.core.exceptions import NotFoundException, UnauthorizedException, BadRequestException, ConflictException

class RecommendationService:

    @staticmethod
    def generate_draft_recommendation(db: Session, assessment_id: str, current_user: Profile) -> Recommendation:
        assessment = db.query(Assessment).filter(Assessment.id == str(assessment_id)).first()
        if not assessment:
            raise NotFoundException(f"Assessment with ID '{assessment_id}' not found")

        result = db.query(AssessmentResult).filter(AssessmentResult.assessment_id == str(assessment_id)).first()
        dominant = result.dominant_dosha if result else "Vata-Pitta"

        # Rule-based draft suggestion engine (Human-in-the-loop: non-diagnostic draft)
        draft_content = (
            f"Based on the Prakriti evaluation indicating a dominant {dominant} constitution: "
            f"Recommend personalized dietary adjustments, hydration routines, and lifestyle balance. "
            f"Follow-up review recommended in 4 weeks to evaluate seasonal adaptability and dosha stabilization."
        )

        existing = db.query(Recommendation).filter(Recommendation.assessment_id == str(assessment_id)).first()
        if existing:
            existing.draft_text = draft_content
            existing.updated_at = datetime.now(timezone.utc)
            rec = existing
        else:
            rec = Recommendation(
                id=str(uuid.uuid4()),
                assessment_id=str(assessment.id),
                patient_id=str(assessment.patient_id),
                draft_text=draft_content,
                recommended_followup_weeks=4,
                status="draft"
            )
            db.add(rec)

        db.commit()
        db.refresh(rec)
        return rec

    @staticmethod
    def approve_recommendation(db: Session, recommendation_id: str, req: RecommendationApproveRequest, current_user: Profile) -> Recommendation:
        if current_user.role != "doctor":
            raise UnauthorizedException("Only an authorized DOCTOR can review and approve recommendations")

        rec = db.query(Recommendation).filter(Recommendation.id == str(recommendation_id)).first()
        if not rec:
            raise NotFoundException(f"Recommendation with ID '{recommendation_id}' not found")

        rec.approved_text = req.approved_text
        rec.recommended_followup_weeks = req.recommended_followup_weeks or rec.recommended_followup_weeks
        rec.status = "approved"
        rec.approved_by = str(current_user.id)
        rec.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(rec)
        return rec

    @staticmethod
    def get_recommendation_by_assessment(db: Session, assessment_id: str) -> Recommendation:
        rec = db.query(Recommendation).filter(Recommendation.assessment_id == str(assessment_id)).first()
        if not rec:
            raise NotFoundException(f"No recommendation found for assessment '{assessment_id}'")
        return rec
