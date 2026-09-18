import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database.models import (
    Assessment, Patient, Questionnaire, Methodology,
    Question, QuestionOption, Response, Observation, AssessmentResult, Profile
)
from app.assessments.schemas import AssessmentCreateRequest, AssessmentStatusUpdateRequest, ResponseCreateRequest
from app.observations.schemas import ObservationCreateRequest
from app.calculation.engine import PrakritiCalculationEngine
from app.core.exceptions import (
    NotFoundException, UnauthorizedException, BadRequestException, ConflictException
)

VALID_TRANSITIONS = {
    "draft": ["in_progress"],
    "in_progress": ["submitted"],
    "submitted": ["reviewed"],
    "reviewed": ["finalized"],
    "finalized": []  # Terminal state
}

class AssessmentService:

    @staticmethod
    def _verify_patient_access(db: Session, patient_id: str, current_user: Profile) -> Patient:
        try:
            uuid.UUID(patient_id)
        except ValueError:
            raise BadRequestException(f"Invalid patient UUID format: {patient_id}")

        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise NotFoundException(f"Patient with ID '{patient_id}' not found")

        if current_user.role == "doctor":
            return patient
        elif current_user.role == "student":
            if patient.created_by != current_user.id:
                raise UnauthorizedException("Student does not have permission for this patient")
            return patient
        elif current_user.role == "patient":
            if patient.id != current_user.id and patient.created_by != current_user.id:
                raise UnauthorizedException("Patient can only access their own assessment data")
            return patient

        raise UnauthorizedException("Permission denied")

    @staticmethod
    def create_assessment(db: Session, req: AssessmentCreateRequest, current_user: Profile) -> Assessment:
        if current_user.role not in ["doctor", "student"]:
            raise UnauthorizedException("Only doctors and students can initiate assessments")

        # Validate Patient
        patient = AssessmentService._verify_patient_access(db, req.patient_id, current_user)

        # Validate Questionnaire
        try:
            uuid.UUID(req.questionnaire_id)
        except ValueError:
            raise BadRequestException(f"Invalid questionnaire UUID format: {req.questionnaire_id}")

        questionnaire = db.query(Questionnaire).filter(Questionnaire.id == req.questionnaire_id).first()
        if not questionnaire:
            raise NotFoundException(f"Questionnaire with ID '{req.questionnaire_id}' not found")
        if not questionnaire.is_active:
            raise BadRequestException("Questionnaire is inactive")

        # Validate Methodology
        try:
            uuid.UUID(req.methodology_id)
        except ValueError:
            raise BadRequestException(f"Invalid methodology UUID format: {req.methodology_id}")

        methodology = db.query(Methodology).filter(Methodology.id == req.methodology_id).first()
        if not methodology:
            raise NotFoundException(f"Methodology with ID '{req.methodology_id}' not found")
        if not methodology.is_active:
            raise BadRequestException("Methodology is inactive")

        assessment = Assessment(
            id=str(uuid.uuid4()),
            patient_id=patient.id,
            conducted_by=current_user.id,
            questionnaire_id=questionnaire.id,
            methodology_id=methodology.id,
            status="draft",
            started_at=datetime.now(timezone.utc)
        )
        db.add(assessment)
        db.commit()
        db.refresh(assessment)
        return assessment

    @staticmethod
    def get_assessment_by_id(db: Session, assessment_id: str, current_user: Profile) -> Assessment:
        try:
            uuid.UUID(assessment_id)
        except ValueError:
            raise BadRequestException(f"Invalid assessment UUID format: {assessment_id}")

        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
        if not assessment:
            raise NotFoundException(f"Assessment with ID '{assessment_id}' not found")

        # Verify access via patient ownership
        AssessmentService._verify_patient_access(db, assessment.patient_id, current_user)
        return assessment

    @staticmethod
    def update_assessment_status(db: Session, assessment_id: str, req: AssessmentStatusUpdateRequest, current_user: Profile) -> Assessment:
        assessment = AssessmentService.get_assessment_by_id(db, assessment_id, current_user)
        target_status = req.status.lower()

        # Finalized check
        if assessment.status == "finalized":
            raise ConflictException("Assessment is FINALIZED and read-only. Status cannot be modified.")

        # Validate transition
        allowed_next = VALID_TRANSITIONS.get(assessment.status, [])
        if target_status not in allowed_next:
            raise ConflictException(
                f"Invalid state transition from '{assessment.status}' to '{target_status}'. Allowed transitions: {allowed_next}"
            )

        # Check SUBMITTED requirements
        if target_status == "submitted":
            # Check required questions
            required_questions = db.query(Question).filter(
                Question.questionnaire_id == assessment.questionnaire_id,
                Question.is_required == True
            ).all()

            answered_question_ids = {
                r.question_id for r in db.query(Response).filter(Response.assessment_id == assessment.id).all()
            }

            missing = [q for q in required_questions if q.id not in answered_question_ids]
            if missing:
                missing_texts = ", ".join([f"'{q.question_text}'" for q in missing[:3]])
                raise BadRequestException(
                    f"Cannot submit assessment. Missing required question answers: {missing_texts}"
                )
            assessment.submitted_at = datetime.now(timezone.utc)

        # Check FINALIZED permissions
        if target_status == "finalized":
            if current_user.role != "doctor":
                raise UnauthorizedException("Only an authorized DOCTOR can finalize an assessment")
            assessment.finalized_at = datetime.now(timezone.utc)

        assessment.status = target_status
        db.commit()
        db.refresh(assessment)
        return assessment

    @staticmethod
    def add_response(db: Session, assessment_id: str, req: ResponseCreateRequest, current_user: Profile) -> Response:
        assessment = AssessmentService.get_assessment_by_id(db, assessment_id, current_user)

        if assessment.status == "finalized":
            raise ConflictException("Assessment is FINALIZED and read-only. Responses cannot be modified.")

        # Verify question exists & belongs to assessment's questionnaire
        question = db.query(Question).filter(Question.id == req.question_id).first()
        if not question:
            raise NotFoundException(f"Question with ID '{req.question_id}' not found")
        if question.questionnaire_id != assessment.questionnaire_id:
            raise BadRequestException("Question does not belong to this assessment's questionnaire")

        # Verify selected option belongs to question
        option = db.query(QuestionOption).filter(QuestionOption.id == req.selected_option_id).first()
        if not option:
            raise NotFoundException(f"Option with ID '{req.selected_option_id}' not found")
        if option.question_id != question.id:
            raise BadRequestException("Selected option does not belong to the specified question")

        # Check existing response for upsert
        existing_resp = db.query(Response).filter(
            Response.assessment_id == assessment_id,
            Response.question_id == req.question_id
        ).first()

        if existing_resp:
            existing_resp.selected_option_id = req.selected_option_id
            existing_resp.text_answer = req.text_answer
            existing_resp.updated_at = datetime.now(timezone.utc)
            resp = existing_resp
        else:
            resp = Response(
                id=str(uuid.uuid4()),
                assessment_id=assessment_id,
                question_id=req.question_id,
                selected_option_id=req.selected_option_id,
                text_answer=req.text_answer
            )
            db.add(resp)

        # Automatically advance draft status to in_progress upon response entry
        if assessment.status == "draft":
            assessment.status = "in_progress"

        db.commit()
        db.refresh(resp)
        return resp

    @staticmethod
    def add_observation(db: Session, assessment_id: str, req: ObservationCreateRequest, current_user: Profile) -> Observation:
        if current_user.role not in ["doctor", "student"]:
            raise UnauthorizedException("Only doctors and students can add practitioner observations")

        assessment = AssessmentService.get_assessment_by_id(db, assessment_id, current_user)

        if assessment.status == "finalized":
            raise ConflictException("Assessment is FINALIZED and read-only. Observations cannot be added.")

        obs = Observation(
            id=str(uuid.uuid4()),
            assessment_id=assessment_id,
            created_by=current_user.id,
            notes=req.notes
        )
        db.add(obs)
        db.commit()
        db.refresh(obs)
        return obs

    @staticmethod
    def calculate_prakriti(db: Session, assessment_id: str, current_user: Profile) -> AssessmentResult:
        if current_user.role not in ["doctor", "student"]:
            raise UnauthorizedException("Only doctors and students can calculate Prakriti results")

        assessment = AssessmentService.get_assessment_by_id(db, assessment_id, current_user)

        if assessment.status == "finalized":
            raise ConflictException("Assessment is FINALIZED and read-only. Re-calculation is prohibited.")

        # Retrieve all responses with option scores
        responses = db.query(Response).filter(Response.assessment_id == assessment_id).all()
        if not responses:
            raise BadRequestException("Cannot calculate Prakriti: No responses submitted for this assessment")

        option_scores = []
        for r in responses:
            if r.selected_option:
                option_scores.append({
                    "vata": float(r.selected_option.vata_score or 0.0),
                    "pitta": float(r.selected_option.pitta_score or 0.0),
                    "kapha": float(r.selected_option.kapha_score or 0.0),
                })

        computed = PrakritiCalculationEngine.compute_prakriti(option_scores)

        # Delete old result if recalculating in non-finalized state
        db.query(AssessmentResult).filter(AssessmentResult.assessment_id == assessment_id).delete()

        result = AssessmentResult(
            id=str(uuid.uuid4()),
            assessment_id=assessment_id,
            vata_percentage=computed["vata_percentage"],
            pitta_percentage=computed["pitta_percentage"],
            kapha_percentage=computed["kapha_percentage"],
            dominant_dosha=computed["dominant_dosha"],
            calculation_version=computed["calculation_version"],
            calculated_at=datetime.now(timezone.utc)
        )
        db.add(result)
        db.commit()
        db.refresh(result)
        return result

    @staticmethod
    def get_assessment_result(db: Session, assessment_id: str, current_user: Profile) -> AssessmentResult:
        assessment = AssessmentService.get_assessment_by_id(db, assessment_id, current_user)

        result = db.query(AssessmentResult).filter(AssessmentResult.assessment_id == assessment_id).first()
        if not result:
            raise NotFoundException(f"Calculation result for assessment '{assessment_id}' does not exist yet")
        return result
