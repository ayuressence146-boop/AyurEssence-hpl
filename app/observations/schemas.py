import uuid
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional
from datetime import datetime

class ObservationCreateRequest(BaseModel):
    notes: str = Field(..., min_length=1, description="Practitioner clinical notes and observations")

class ObservationResponse(BaseModel):
    id: str
    assessment_id: str
    created_by: Optional[str] = None
    notes: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "assessment_id", "created_by", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v
