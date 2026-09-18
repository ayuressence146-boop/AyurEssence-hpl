import uuid
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import Optional
from datetime import datetime

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2, max_length=150)
    role: str = Field(..., description="Role: doctor, student, or patient")
    phone: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProfileResponse(BaseModel):
    id: str
    full_name: str
    role: str
    phone: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("id", mode="before")
    def coerce_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    profile: ProfileResponse
