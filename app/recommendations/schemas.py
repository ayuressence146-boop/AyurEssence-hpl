import uuid
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional
from datetime import datetime

class RecommendationCreateRequest(BaseModel):
    recommended_followup_weeks: Optional[int] = 4
    draft_text: Optional[str] = None

class RecommendationApproveRequest(BaseModel):
    approved_text: str = Field(..., min_length=5)
    recommended_followup_weeks: Optional[int] = 4

class RecommendationResponse(BaseModel):
    id: str
    assessment_id: str
    patient_id: str
    draft_text: str
    approved_text: Optional[str] = None
    recommended_followup_weeks: int
    status: str
    approved_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "assessment_id", "patient_id", "approved_by", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v
