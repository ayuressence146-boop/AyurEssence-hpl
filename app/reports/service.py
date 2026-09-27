import uuid
import secrets
from datetime import datetime, timezone, timedelta
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.database.models import Report, ReportShareToken, Assessment, AssessmentResult, Patient, MethodologyReference, Recommendation, Profile
from app.reports.schemas import ReportCreateRequest, ReportShareRequest
from app.core.exceptions import NotFoundException, UnauthorizedException, BadRequestException, ConflictException

class ReportService:

    @staticmethod
    def generate_report(db: Session, assessment_id: str, req: ReportCreateRequest, current_user: Profile) -> Report:
        assessment = db.query(Assessment).filter(Assessment.id == str(assessment_id)).first()
        if not assessment:
            raise NotFoundException(f"Assessment with ID '{assessment_id}' not found")

        result = db.query(AssessmentResult).filter(AssessmentResult.assessment_id == str(assessment_id)).first()
        patient = db.query(Patient).filter(Patient.id == str(assessment.patient_id)).first()
        recommendation = db.query(Recommendation).filter(Recommendation.assessment_id == str(assessment_id)).first()

        if req.report_type == "doctor_full":
            # Fetch classical methodology citations
            citations = []
            if assessment.questionnaire and assessment.questionnaire.methodology_id:
                refs = db.query(MethodologyReference).filter(
                    MethodologyReference.methodology_id == str(assessment.questionnaire.methodology_id)
                ).all()
                for ref in refs:
                    citations.append({
                        "title": ref.title,
                        "citation": ref.citation,
                        "reference_url": ref.reference_url
                    })

            report_data = {
                "header": "Practitioner Full Clinical Prakriti Report",
                "patient": {
                    "id": str(patient.id) if patient else None,
                    "name": patient.full_name if patient else "N/A",
                    "dob": str(patient.date_of_birth) if patient and patient.date_of_birth else None,
                    "gender": patient.gender if patient else None
                },
                "assessment_status": assessment.status,
                "conducted_by": str(assessment.conducted_by),
                "calculation": {
                    "vata_percentage": float(result.vata_percentage) if result else 0.0,
                    "pitta_percentage": float(result.pitta_percentage) if result else 0.0,
                    "kapha_percentage": float(result.kapha_percentage) if result else 0.0,
                    "dominant_dosha": result.dominant_dosha if result else "N/A",
                    "calculation_version": result.calculation_version if result else "1.0"
                } if result else None,
                "methodology_citations": citations,
                "practitioner_recommendation": recommendation.approved_text if recommendation and recommendation.approved_text else (recommendation.draft_text if recommendation else None),
                "observations_count": len(assessment.observations)
            }
        else:
            # Patient Summary View (Simplified & Jargon-Free)
            report_data = {
                "header": "Your AyurEssence Prakriti Health Summary",
                "patient_name": patient.full_name if patient else "Patient",
                "dominant_dosha_profile": result.dominant_dosha if result else "Balanced",
                "dosha_percentages": {
                    "Vata": f"{float(result.vata_percentage)}%" if result else "0%",
                    "Pitta": f"{float(result.pitta_percentage)}%" if result else "0%",
                    "Kapha": f"{float(result.kapha_percentage)}%" if result else "0%"
                },
                "explanation": (
                    f"Your primary body constitution is {result.dominant_dosha if result else 'Balanced'}. "
                    f"This profile guides your optimal diet, daily routine, and wellness balance."
                ),
                "approved_doctor_recommendation": recommendation.approved_text if recommendation and recommendation.approved_text else "Follow doctor's guidance during your review.",
                "next_followup": f"Recommended review in {recommendation.recommended_followup_weeks if recommendation else 4} weeks."
            }

        report = Report(
            id=str(uuid.uuid4()),
            assessment_id=str(assessment.id),
            report_type=req.report_type,
            report_data=report_data,
            generated_by=str(current_user.id)
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

    @staticmethod
    def create_share_link(db: Session, report_id: str, req: ReportShareRequest, current_user: Profile) -> Dict[str, Any]:
        report = db.query(Report).filter(Report.id == str(report_id)).first()
        if not report:
            raise NotFoundException(f"Report with ID '{report_id}' not found")

        # Generate secure random token
        token_str = secrets.token_urlsafe(32)
        hours = req.expires_in_hours or 48
        expires_at = datetime.now(timezone.utc) + timedelta(hours=hours)

        share_token = ReportShareToken(
            id=str(uuid.uuid4()),
            report_id=str(report.id),
            token=token_str,
            channel=req.channel,
            recipient=req.recipient,
            expires_at=expires_at,
            created_by=str(current_user.id)
        )
        db.add(share_token)
        db.commit()
        db.refresh(share_token)

        share_url = f"/api/reports/shared/{token_str}"

        return {
            "id": str(share_token.id),
            "report_id": str(report.id),
            "token": token_str,
            "share_url": share_url,
            "channel": req.channel,
            "recipient": req.recipient,
            "expires_at": expires_at,
            "is_accessed": False
        }

    @staticmethod
    def get_shared_report_by_token(db: Session, token_str: str) -> Dict[str, Any]:
        st = db.query(ReportShareToken).filter(ReportShareToken.token == token_str).first()
        if not st:
            raise NotFoundException("Invalid or expired report share link")

        exp_at = st.expires_at.replace(tzinfo=timezone.utc) if st.expires_at and st.expires_at.tzinfo is None else st.expires_at
        if datetime.now(timezone.utc) > exp_at:
            raise BadRequestException("This report link has expired for security reasons")

        st.is_accessed = True
        db.commit()

        report = db.query(Report).filter(Report.id == str(st.report_id)).first()
        return report.report_data
