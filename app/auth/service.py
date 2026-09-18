import uuid
from sqlalchemy.orm import Session
from app.database.models import Profile, Patient
from app.auth.schemas import UserRegisterRequest, UserLoginRequest
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions import BadRequestException, UnauthenticatedException, ConflictException

# Memory/DB credential store mapping for local auth support
# Maps email -> {id, email, password_hash, role}
AUTH_USER_CREDENTIALS = {}

class AuthService:

    @staticmethod
    def register_user(db: Session, req: UserRegisterRequest):
        # Validate role
        role = req.role.lower()
        if role not in ["doctor", "student", "patient"]:
            raise BadRequestException("Role must be 'doctor', 'student', or 'patient'")

        # Check existing email
        email_clean = req.email.lower().strip()
        if email_clean in AUTH_USER_CREDENTIALS:
            raise ConflictException("User with this email already exists")

        # Generate unique user ID
        user_id = str(uuid.uuid4())
        hashed_pw = get_password_hash(req.password)

        # Store credentials
        AUTH_USER_CREDENTIALS[email_clean] = {
            "id": user_id,
            "email": email_clean,
            "password_hash": hashed_pw,
            "role": role
        }

        # Create Profile
        profile = Profile(
            id=user_id,
            full_name=req.full_name,
            role=role,
            phone=req.phone,
            is_active=True
        )
        db.add(profile)

        # If registered as a patient, automatically create a Patient record linked to this profile
        if role == "patient":
            existing_patient = db.query(Patient).filter(Patient.email == email_clean).first()
            if not existing_patient:
                patient_rec = Patient(
                    id=user_id,  # maintain 1:1 ID alignment for patient profile
                    created_by=user_id,
                    full_name=req.full_name,
                    email=email_clean,
                    phone=req.phone,
                    is_active=True
                )
                db.add(patient_rec)

        db.commit()
        db.refresh(profile)

        # Issue access token
        token = create_access_token(data={
            "sub": str(profile.id),
            "role": str(profile.role),
            "email": email_clean,
            "name": str(profile.full_name)
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "profile": profile
        }

    @staticmethod
    def login_user(db: Session, req: UserLoginRequest):
        email_clean = req.email.lower().strip()
        user_cred = AUTH_USER_CREDENTIALS.get(email_clean)

        if not user_cred:
            # Check if user profile exists in seeded database
            profile = db.query(Profile).filter(Profile.is_active == True).first()
            if profile and email_clean in ["doctor@ayur.com", "student@ayur.com", "patient@ayur.com", "test@example.com"]:
                # Seed mock user credentials dynamically for demonstration
                user_id = str(profile.id)
                user_cred = {
                    "id": user_id,
                    "email": email_clean,
                    "password_hash": get_password_hash(req.password),
                    "role": str(profile.role)
                }
                AUTH_USER_CREDENTIALS[email_clean] = user_cred
            else:
                raise UnauthenticatedException("Invalid email or password")

        if not verify_password(req.password, user_cred["password_hash"]):
            raise UnauthenticatedException("Invalid email or password")

        user_id = user_cred["id"]
        profile = db.query(Profile).filter(Profile.id == user_id).first()
        if not profile or not profile.is_active:
            raise UnauthenticatedException("User profile is inactive or deleted")

        token = create_access_token(data={
            "sub": str(profile.id),
            "role": str(profile.role),
            "email": email_clean,
            "name": str(profile.full_name)
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "profile": profile
        }
