import uuid
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import Optional
from datetime import date, datetime

class PatientCreateRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(None, max_length=30)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = None

class PatientUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=150)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(None, max_length=30)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    is_active: Optional[bool] = None

class PatientResponse(BaseModel):
    id: str
    created_by: Optional[str] = None
    full_name: str
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", "created_by", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v
