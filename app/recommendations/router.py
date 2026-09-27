from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.database.models import Profile
from app.recommendations.schemas import RecommendationResponse, RecommendationApproveRequest
from app.recommendations.service import RecommendationService

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.post("/assessment/{assessment_id}/draft", response_model=RecommendationResponse, status_code=status.HTTP_201_CREATED)
def generate_draft(assessment_id: str, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return RecommendationService.generate_draft_recommendation(db, assessment_id, current_user)

@router.patch("/{recommendation_id}/approve", response_model=RecommendationResponse)
def approve_recommendation(recommendation_id: str, req: RecommendationApproveRequest, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return RecommendationService.approve_recommendation(db, recommendation_id, req, current_user)

@router.get("/assessment/{assessment_id}", response_model=RecommendationResponse)
def get_recommendation(assessment_id: str, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return RecommendationService.get_recommendation_by_assessment(db, assessment_id)
