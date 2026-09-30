import uuid
from typing import List
from sqlalchemy.orm import Session
from app.database.models import Patient, Profile, Assessment
from app.patients.schemas import PatientCreateRequest, PatientUpdateRequest
from app.core.exceptions import NotFoundException, UnauthorizedException, BadRequestException
from sqlalchemy import or_

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
            # Doctors see only patients in the patients table (not student/doctor profile users)
            return query.all()
        elif current_user.role == "student":
            # Students see patients they created OR patients assigned to them via an assessment
            assigned_patient_ids = (
                db.query(Assessment.patient_id)
                .filter(Assessment.assigned_to == current_user.id)
                .subquery()
            )
            return query.filter(
                or_(
                    Patient.created_by == current_user.id,
                    Patient.id.in_(assigned_patient_ids)
                )
            ).all()
        elif current_user.role == "patient":
            return query.filter(
                or_(
                    Patient.id == current_user.id,
                    Patient.created_by == current_user.id
                )
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
            # Allow if student created the patient OR is assigned an assessment for this patient
            if patient.created_by == current_user.id:
                return patient
            assigned = db.query(Assessment).filter(
                Assessment.patient_id == str(patient.id),
                Assessment.assigned_to == str(current_user.id)
            ).first()
            if assigned:
                return patient
            raise UnauthorizedException("Student does not have permission to view this patient")
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

    @staticmethod
    def get_patient_assessments(db: Session, patient_id: str, current_user: Profile) -> List[Assessment]:
        """List all assessments for a patient, sorted newest first.
        Students only see assessments assigned to them for this patient.
        Doctors see all assessments.
        """
        patient = PatientService.get_patient_by_id(db, patient_id, current_user)
        query = db.query(Assessment).filter(Assessment.patient_id == str(patient.id))
        if current_user.role == "student":
            # Student only sees their assigned assessments for this patient
            query = query.filter(
                or_(
                    Assessment.assigned_to == str(current_user.id),
                    Assessment.conducted_by == str(current_user.id)
                )
            )
        return query.order_by(Assessment.created_at.desc()).all()

    @staticmethod
    def get_patient_timeline(db: Session, patient_id: str, current_user: Profile) -> List[dict]:
        patient = PatientService.get_patient_by_id(db, patient_id, current_user)
        
        timeline = []
        for ass in sorted(patient.assessments, key=lambda a: a.created_at, reverse=True):
            result = ass.results[0] if ass.results else None
            timeline.append({
                "assessment_id": str(ass.id),
                "date": ass.created_at.strftime("%Y-%m-%d"),
                "status": ass.status,
                "conducted_by": str(ass.conducted_by) if ass.conducted_by else None,
                "vata_percentage": float(result.vata_percentage) if result else None,
                "pitta_percentage": float(result.pitta_percentage) if result else None,
                "kapha_percentage": float(result.kapha_percentage) if result else None,
                "dominant_dosha": result.dominant_dosha if result else None,
                "finalized_at": ass.finalized_at.isoformat() if ass.finalized_at else None
            })

        return timeline

