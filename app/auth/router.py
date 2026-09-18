from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Profile
from app.core.dependencies import get_current_user
from app.auth.schemas import UserRegisterRequest, UserLoginRequest, AuthTokenResponse, ProfileResponse
from app.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new user (Doctor, Student, or Patient) and receive JWT token."""
    return AuthService.register_user(db, req)

@router.post("/login", response_model=AuthTokenResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    """Authenticate existing user credentials and receive JWT token."""
    return AuthService.login_user(db, req)

@router.get("/me", response_model=ProfileResponse)
def get_me(current_user: Profile = Depends(get_current_user)):
    """Retrieve profile of the currently authenticated user."""
    return current_user
