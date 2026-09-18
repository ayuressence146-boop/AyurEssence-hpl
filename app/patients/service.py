import uuid
from typing import List
from sqlalchemy.orm import Session
from app.database.models import Patient, Profile
from app.patients.schemas import PatientCreateRequest, PatientUpdateRequest
from app.core.exceptions import NotFoundException, UnauthorizedException, BadRequestException

class PatientService:

    @staticmethod
    def create_patient(db: Session, req: PatientCreateRequest, current_user: Profile) -> Patient:
        if current_user.role not in ["doctor", "student"]:
            raise UnauthorizedException("Only doctors and students can create patient records")
        
        patient = Patient(
            id=str(uuid.uuid4()),
            created_by=current_user.id,
            full_name=req.full_name,
            date_of_birth=req.date_of_birth,
            gender=req.gender,
            phone=req.phone,
            email=req.email.lower() if req.email else None,
            address=req.address,
            is_active=True
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)
        return patient

    @staticmethod
    def list_patients(db: Session, current_user: Profile) -> List[Patient]:
        query = db.query(Patient).filter(Patient.is_active == True)
        
        if current_user.role == "doctor":
            return query.all()
        elif current_user.role == "student":
            return query.filter(Patient.created_by == current_user.id).all()
        elif current_user.role == "patient":
            return query.filter(
                (Patient.id == current_user.id) | 
                (Patient.created_by == current_user.id)
            ).all()
        return []

    @staticmethod
    def get_patient_by_id(db: Session, patient_id: str, current_user: Profile) -> Patient:
        # Validate UUID format
        try:
            uuid.UUID(patient_id)
        except ValueError:
            raise BadRequestException(f"Invalid patient UUID format: {patient_id}")

        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise NotFoundException(f"Patient with ID '{patient_id}' does not exist")

        # Check RBAC & Resource ownership
        if current_user.role == "doctor":
            return patient
        elif current_user.role == "student":
            if patient.created_by != current_user.id:
                raise UnauthorizedException("Student does not have permission to view this patient")
            return patient
        elif current_user.role == "patient":
            if patient.id != current_user.id and patient.created_by != current_user.id:
                raise UnauthorizedException("Patient can only view their own record")
            return patient

        raise UnauthorizedException("Permission denied")

    @staticmethod
    def update_patient(db: Session, patient_id: str, req: PatientUpdateRequest, current_user: Profile) -> Patient:
        if current_user.role not in ["doctor", "student"]:
            raise UnauthorizedException("Only doctors and students can update patient records")

        patient = PatientService.get_patient_by_id(db, patient_id, current_user)

        update_data = req.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if key == "email" and value:
                value = value.lower()
            setattr(patient, key, value)

        db.commit()
        db.refresh(patient)
        return patient
