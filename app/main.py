from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import (
    APIException, api_exception_handler,
    validation_exception_handler, general_exception_handler
)
from app.database.connection import init_db
from app.auth.router import router as auth_router
from app.patients.router import router as patients_router
from app.questionnaires.router import router as questionnaires_router
from app.assessments.router import router as assessments_router

# Initialize database schema on startup
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AyurEssence — An Intelligent Ayurvedic Prakriti Assessment Platform (HPL 2026 Evaluation 2 Backend API)",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for future frontend integration & local API testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(patients_router, prefix=settings.API_V1_STR)
app.include_router(questionnaires_router, prefix=settings.API_V1_STR)
app.include_router(assessments_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health Check"])
def health_check():
    """System health check endpoint."""
    return {
        "status": "ok",
        "service": "ayurEssence-backend"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
