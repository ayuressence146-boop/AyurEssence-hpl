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
from app.recommendations.router import router as recommendations_router
from app.reminders.router import router as reminders_router
from app.reports.router import router as reports_router
from app.educational.router import router as educational_router

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
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include API Routers with /api/v1 and /api prefixes
for prefix in [settings.API_V1_STR, "/api"]:
    app.include_router(auth_router, prefix=prefix)
    app.include_router(patients_router, prefix=prefix)
    app.include_router(questionnaires_router, prefix=prefix)
    app.include_router(assessments_router, prefix=prefix)
    app.include_router(recommendations_router, prefix=prefix)
    app.include_router(reminders_router, prefix=prefix)
    app.include_router(reports_router, prefix=prefix)
    app.include_router(educational_router, prefix=prefix)

@app.get("/health", tags=["Health Check"])
def health_check():
    """System health check endpoint."""
    return {
        "status": "ok",
        "service": "ayurEssence-backend"
    }

from fastapi.staticfiles import StaticFiles
import os

frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
