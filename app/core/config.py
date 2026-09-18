import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AyurEssence Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Supabase Configuration
    SUPABASE_URL: str = "https://your-supabase-project.supabase.co"
    SUPABASE_ANON_KEY: str = "mock-anon-key"
    SUPABASE_SERVICE_ROLE_KEY: str = "mock-service-role-key"

    # Database URL
    DATABASE_URL: str = "sqlite:///./ayurbase.db"

    # Security & Auth
    JWT_SECRET: str = "super-secret-jwt-key-change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
