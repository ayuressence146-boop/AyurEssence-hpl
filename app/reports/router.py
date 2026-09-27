from typing import Dict, Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.database.models import Profile
from app.reports.schemas import ReportCreateRequest, ReportShareRequest, ReportDetailResponse, ReportShareResponse
from app.reports.service import ReportService

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.post("/assessment/{assessment_id}", response_model=ReportDetailResponse, status_code=status.HTTP_201_CREATED)
def generate_report(assessment_id: str, req: ReportCreateRequest, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return ReportService.generate_report(db, assessment_id, req, current_user)

@router.post("/{report_id}/share", response_model=ReportShareResponse, status_code=status.HTTP_201_CREATED)
def create_share_link(report_id: str, req: ReportShareRequest, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return ReportService.create_share_link(db, report_id, req, current_user)

@router.get("/shared/{token}")
def access_shared_report(token: str, db: Session = Depends(get_db)):
    return ReportService.get_shared_report_by_token(db, token)
