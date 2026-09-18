import uuid
from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime

class AssessmentResultResponse(BaseModel):
    id: str
    assessment_id: str
    vata_percentage: float = Field(..., ge=0, le=100)
    pitta_percentage: float = Field(..., ge=0, le=100)
    kapha_percentage: float = Field(..., ge=0, le=100)
    dominant_dosha: str
    calculation_version: str
    calculated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "assessment_id", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v
