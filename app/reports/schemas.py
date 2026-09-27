import uuid
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, Any, Dict
from datetime import datetime

class ReportCreateRequest(BaseModel):
    report_type: str = Field("doctor_full", description="doctor_full or patient_summary")

class ReportShareRequest(BaseModel):
    channel: str = Field(..., description="whatsapp, email, sms")
    recipient: str = Field(..., description="Phone number or Email address")
    expires_in_hours: Optional[int] = 48

class ReportShareResponse(BaseModel):
    id: str
    report_id: str
    token: str
    share_url: str
    channel: str
    recipient: str
    expires_at: datetime
    is_accessed: bool

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "report_id", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v

class ReportDetailResponse(BaseModel):
    id: str
    assessment_id: str
    report_type: str
    report_data: Dict[str, Any]
    generated_by: Optional[str] = None
    generated_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "assessment_id", "generated_by", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v
