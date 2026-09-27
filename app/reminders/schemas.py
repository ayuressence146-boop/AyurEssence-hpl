import uuid
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import date, datetime

class FollowupReminderCreateRequest(BaseModel):
    assessment_id: str
    patient_id: str
    scheduled_date: date
    channel: str = Field("in_app", description="in_app, email, sms, whatsapp")
    notes: Optional[str] = None

class FollowupReminderUpdateRequest(BaseModel):
    scheduled_date: Optional[date] = None
    channel: Optional[str] = None
    status: Optional[str] = Field(None, description="pending, sent, cancelled")
    notes: Optional[str] = None

class FollowupReminderResponse(BaseModel):
    id: str
    assessment_id: str
    patient_id: str
    created_by: Optional[str] = None
    scheduled_date: date
    channel: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "assessment_id", "patient_id", "created_by", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v
