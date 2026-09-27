import uuid
from datetime import datetime, timezone
from typing import List
from sqlalchemy.orm import Session
from app.database.models import FollowupReminder, Assessment, Patient, Profile
from app.reminders.schemas import FollowupReminderCreateRequest, FollowupReminderUpdateRequest
from app.core.exceptions import NotFoundException, UnauthorizedException, BadRequestException

class ReminderService:

    @staticmethod
    def create_reminder(db: Session, req: FollowupReminderCreateRequest, current_user: Profile) -> FollowupReminder:
        if current_user.role not in ["doctor", "student"]:
            raise UnauthorizedException("Only doctors and students can schedule follow-up reminders")

        assessment = db.query(Assessment).filter(Assessment.id == str(req.assessment_id)).first()
        if not assessment:
            raise NotFoundException(f"Assessment with ID '{req.assessment_id}' not found")

        reminder = FollowupReminder(
            id=str(uuid.uuid4()),
            assessment_id=str(req.assessment_id),
            patient_id=str(req.patient_id),
            created_by=str(current_user.id),
            scheduled_date=req.scheduled_date,
            channel=req.channel,
            status="pending",
            notes=req.notes
        )
        db.add(reminder)
        db.commit()
        db.refresh(reminder)
        return reminder

    @staticmethod
    def get_reminders_for_patient(db: Session, patient_id: str) -> List[FollowupReminder]:
        return db.query(FollowupReminder).filter(
            FollowupReminder.patient_id == str(patient_id)
        ).order_by(FollowupReminder.scheduled_date.asc()).all()

    @staticmethod
    def update_reminder(db: Session, reminder_id: str, req: FollowupReminderUpdateRequest, current_user: Profile) -> FollowupReminder:
        reminder = db.query(FollowupReminder).filter(FollowupReminder.id == str(reminder_id)).first()
        if not reminder:
            raise NotFoundException(f"Reminder with ID '{reminder_id}' not found")

        if req.scheduled_date:
            reminder.scheduled_date = req.scheduled_date
        if req.channel:
            reminder.channel = req.channel
        if req.status:
            reminder.status = req.status
        if req.notes is not None:
            reminder.notes = req.notes

        reminder.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(reminder)
        return reminder
