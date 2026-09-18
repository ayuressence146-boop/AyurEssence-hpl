import uuid
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime
from app.observations.schemas import ObservationResponse
from app.calculation.schemas import AssessmentResultResponse

class AssessmentCreateRequest(BaseModel):
    patient_id: str
    questionnaire_id: str
    methodology_id: str

class AssessmentStatusUpdateRequest(BaseModel):
    status: str = Field(..., description="Target status: draft, in_progress, submitted, reviewed, finalized")

class ResponseCreateRequest(BaseModel):
    question_id: str
    selected_option_id: str
    text_answer: Optional[str] = None

class ResponseDetailResponse(BaseModel):
    id: str
    assessment_id: str
    question_id: str
    selected_option_id: Optional[str] = None
    text_answer: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "assessment_id", "question_id", "selected_option_id", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v

class AssessmentDetailResponse(BaseModel):
    id: str
    patient_id: str
    conducted_by: Optional[str] = None
    questionnaire_id: str
    methodology_id: str
    status: str
    started_at: datetime
    submitted_at: Optional[datetime] = None
    finalized_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    responses: List[ResponseDetailResponse] = []
    observations: List[ObservationResponse] = []
    results: List[AssessmentResultResponse] = []

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "patient_id", "conducted_by", "questionnaire_id", "methodology_id", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v
