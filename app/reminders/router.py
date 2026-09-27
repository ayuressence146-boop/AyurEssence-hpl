from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.database.models import Profile
from app.reminders.schemas import FollowupReminderCreateRequest, FollowupReminderUpdateRequest, FollowupReminderResponse
from app.reminders.service import ReminderService

router = APIRouter(prefix="/api/reminders", tags=["Reminders"])

@router.post("", response_model=FollowupReminderResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(req: FollowupReminderCreateRequest, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return ReminderService.create_reminder(db, req, current_user)

@router.get("/patient/{patient_id}", response_model=List[FollowupReminderResponse])
def get_reminders_for_patient(patient_id: str, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return ReminderService.get_reminders_for_patient(db, patient_id)

@router.patch("/{reminder_id}", response_model=FollowupReminderResponse)
def update_reminder(reminder_id: str, req: FollowupReminderUpdateRequest, db: Session = Depends(get_db), current_user: Profile = Depends(get_current_user)):
    return ReminderService.update_reminder(db, reminder_id, req, current_user)
