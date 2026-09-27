import uuid
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime

class MentorFeedbackCreateRequest(BaseModel):
    assessment_id: str
    student_id: str
    feedback_type: str = Field("tip", description="positive, warning, tip, correction")
    notes: str = Field(..., min_length=5)

class MentorFeedbackResponse(BaseModel):
    id: str
    assessment_id: str
    student_id: str
    doctor_id: Optional[str] = None
    feedback_type: str
    notes: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "assessment_id", "student_id", "doctor_id", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v

class StudentAnalyticsResponse(BaseModel):
    student_id: str
    student_name: str
    assessments_conducted: int
    doctor_reviewed_count: int
    pending_review_count: int
    feedback_received_count: int

class InterpretationComparisonResponse(BaseModel):
    assessment_id: str
    status: str
    student_notes: List[str]
    doctor_notes: List[str]
    student_calculated_dosha: Optional[str] = None
    finalized_dominant_dosha: Optional[str] = None
