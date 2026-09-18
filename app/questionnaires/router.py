from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.questionnaires.schemas import QuestionnaireSummaryResponse, QuestionnaireDetailResponse
from app.questionnaires.service import QuestionnaireService

router = APIRouter(prefix="/questionnaires", tags=["Questionnaires"])

@router.get("", response_model=List[QuestionnaireSummaryResponse])
def list_questionnaires(db: Session = Depends(get_db)):
    """List all active questionnaires available for assessment creation."""
    return QuestionnaireService.list_active_questionnaires(db)

@router.get("/{questionnaire_id}", response_model=QuestionnaireDetailResponse)
def get_questionnaire(questionnaire_id: str, db: Session = Depends(get_db)):
    """Retrieve full questionnaire metadata, methodology, ordered questions, and options."""
    return QuestionnaireService.get_questionnaire_by_id(db, questionnaire_id)
