import uuid
from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional
from datetime import datetime

class OptionResponse(BaseModel):
    id: str
    question_id: str
    option_text: str
    vata_score: float
    pitta_score: float
    kapha_score: float
    order_index: int

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "question_id", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v

class QuestionResponse(BaseModel):
    id: str
    questionnaire_id: str
    question_text: str
    question_type: str
    is_required: bool
    order_index: int
    options: List[OptionResponse] = []

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "questionnaire_id", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v

class MethodologySimpleResponse(BaseModel):
    id: str
    name: str
    version: str
    source: str

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v

class QuestionnaireSummaryResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    version: str
    methodology_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "methodology_id", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v

class QuestionnaireDetailResponse(QuestionnaireSummaryResponse):
    methodology: Optional[MethodologySimpleResponse] = None
    questions: List[QuestionResponse] = []

    model_config = ConfigDict(from_attributes=True)
