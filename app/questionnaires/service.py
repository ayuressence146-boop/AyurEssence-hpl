import uuid
from typing import List
from sqlalchemy.orm import Session
from app.database.models import Questionnaire
from app.core.exceptions import NotFoundException, BadRequestException

class QuestionnaireService:

    @staticmethod
    def list_active_questionnaires(db: Session) -> List[Questionnaire]:
        return db.query(Questionnaire).filter(Questionnaire.is_active == True).all()

    @staticmethod
    def get_questionnaire_by_id(db: Session, questionnaire_id: str) -> Questionnaire:
        try:
            uuid.UUID(questionnaire_id)
        except ValueError:
            raise BadRequestException(f"Invalid questionnaire UUID format: {questionnaire_id}")

        q = db.query(Questionnaire).filter(Questionnaire.id == questionnaire_id).first()
        if not q:
            raise NotFoundException(f"Questionnaire with ID '{questionnaire_id}' not found")
        return q
