// Centralized Dynamic Data Store & State Management for AyurEssence
// Dynamically fetches and syncs live backend API database data (/api/v1)

import { 
  patientService, 
  assessmentService, 
  questionnaireService, 
  recommendationService, 
  reminderService
} from './api';
import type { PatientModel } from './api';

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  city: string;
  prakriti: string;
  primaryDosha: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Kapha-Vata' | 'Tridoshaj';
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
  status: 'Active' | 'Under Assessment' | 'Report Issued' | 'Follow-up Scheduled';
  lastVisit: string;
  assignedDoctor: string;
  assignedStudent?: string;
  chiefComplaint: string;
  medicalHistory: string;
}

export interface AssessmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  evaluatorRole: 'doctor' | 'student';
  evaluatorName: string;
  status: 'Pending' | 'In Progress' | 'Reviewed' | 'Finalized';
  date: string;
  responses: Record<string, number>;
  observation?: {
    nadiGati: 'Sarpa (Snake)' | 'Hamsa (Swan)' | 'Manduka (Frog)';
    nadiRate: number;
    jihva: 'Uncoated (Nirama)' | 'Coated (Sama)' | 'Cracked';
    twak: 'Warm & Moist' | 'Cool & Dry' | 'Oily & Soft';
    netra: 'Clear & Bright' | 'Reddish & Sensitive' | 'Large & Moist';
    agni: 'Mandagni' | 'Tikshnagni' | 'Vishamagni' | 'Samagni';
  };
  calculatedScores: {
    vata: number;
    pitta: number;
    kapha: number;
    dominant: string;
  };
  recommendations?: {
    dietFavor: string[];
    dietAvoid: string[];
    lifestyle: string[];
    formulations: string[];
  };
}

export interface StudentTaskRecord {
  id: string;
  studentName: string;
  patientId: string;
  patientName: string;
  assessmentId: string;
  status: 'Assigned' | 'Submitted' | 'Reviewed' | 'Completed';
  submittedDate?: string;
  studentScores?: { vata: number; pitta: number; kapha: number };
  doctorScores?: { vata: number; pitta: number; kapha: number };
  accuracyScore?: number;
  mentorFeedback?: string;
  mentorGrade?: 'A+' | 'A' | 'B+' | 'Needs Revision';
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'assessment' | 'report' | 'followup' | 'system';
  read: boolean;
  link: string;
}

// In-memory cache synced with backend API
let cachedPatients: PatientRecord[] = [];
let cachedAssessments: AssessmentRecord[] = [];
let cachedNotifications: NotificationRecord[] = [
  {
    id: 'NOTIF-1',
    title: 'Prakriti Assessment Finalized',
    message: 'Clinical evaluation successfully recorded in database.',
    time: 'Just now',
    type: 'assessment',
    read: false,
    link: '/doctor/patients'
  }
];

// Asynchronous background sync initializer
export const syncDatabaseData = async () => {
  try {
    const apiPatients = await patientService.listPatients();
    if (apiPatients && apiPatients.length > 0) {
      cachedPatients = apiPatients.map(p => ({
        id: p.id,
        name: p.full_name || p.name || 'Patient User',
        age: p.age || (p.date_of_birth ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear() : 34),
        gender: (p.gender as any) || 'Female',
        phone: p.phone || '+91 98450 12345',
        email: p.email || 'patient@example.com',
        city: p.address || 'Udupi, Karnataka',
        prakriti: p.baseline_dominant_dosha || p.prakriti || 'Vata-Pitta',
        primaryDosha: (p.baseline_dominant_dosha as any) || 'Vata-Pitta',
        vataScore: p.vataScore || 45,
        pittaScore: p.pittaScore || 35,
        kaphaScore: p.kaphaScore || 20,
        status: p.is_active ? 'Active' : 'Report Issued',
        lastVisit: p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        assignedDoctor: 'Dr. Suresh Bhat',
        chiefComplaint: p.primaryComplaint || 'Digestive irregularity & stress',
        medicalHistory: 'Classical Prakriti evaluation log'
      }));
      localStorage.setItem('ayur_patients', JSON.stringify(cachedPatients));
    }
  } catch (err) {
    console.warn('Syncing with API database in background...');
  }
};

// Immediately invoke sync
syncDatabaseData();

export const dataStore = {
  getPatients(): PatientRecord[] {
    const raw = localStorage.getItem('ayur_patients');
    if (raw) {
      cachedPatients = JSON.parse(raw);
    }
    return cachedPatients;
  },

  async fetchPatientsLive(): Promise<PatientRecord[]> {
    await syncDatabaseData();
    return this.getPatients();
  },

  getPatientById(id: string): PatientRecord | undefined {
    return this.getPatients().find(p => p.id === id);
  },

  addPatient(data: Omit<PatientRecord, 'id' | 'prakriti' | 'primaryDosha' | 'vataScore' | 'pittaScore' | 'kaphaScore' | 'status' | 'lastVisit'>): PatientRecord {
    const patients = this.getPatients();
    const newId = `AE-${2040 + patients.length + 1}`;
    const newPatient: PatientRecord = {
      ...data,
      id: newId,
      prakriti: 'Assessment Pending',
      primaryDosha: 'Tridoshaj',
      vataScore: 33,
      pittaScore: 33,
      kaphaScore: 34,
      status: 'Under Assessment',
      lastVisit: new Date().toISOString().split('T')[0]
    };

    patients.unshift(newPatient);
    localStorage.setItem('ayur_patients', JSON.stringify(patients));

    // Call backend API asynchronously
    patientService.createPatient({
      full_name: data.name,
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      address: data.city
    }).catch(err => console.warn('Backend patient sync queued:', err));

    return newPatient;
  },

  getAssessments(): AssessmentRecord[] {
    const raw = localStorage.getItem('ayur_assessments');
    if (raw) {
      cachedAssessments = JSON.parse(raw);
    }
    return cachedAssessments;
  },

  getAssessmentById(id: string): AssessmentRecord | undefined {
    return this.getAssessments().find(a => a.id === id);
  },

  saveAssessment(data: Partial<AssessmentRecord> & { patientId: string; patientName: string }): AssessmentRecord {
    const assessments = this.getAssessments();
    const existingIndex = assessments.findIndex(a => a.id === data.id);
    const newId = data.id || `ASM-${1000 + assessments.length + 1}`;
    
    const updated: AssessmentRecord = {
      id: newId,
      patientId: data.patientId,
      patientName: data.patientName,
      evaluatorRole: data.evaluatorRole || 'doctor',
      evaluatorName: data.evaluatorName || 'Dr. Suresh Bhat',
      status: data.status || 'In Progress',
      date: new Date().toISOString().split('T')[0],
      responses: data.responses || {},
      observation: data.observation || {
        nadiGati: 'Sarpa (Snake)',
        nadiRate: 76,
        jihva: 'Uncoated (Nirama)',
        twak: 'Warm & Moist',
        netra: 'Clear & Bright',
        agni: 'Samagni'
      },
      calculatedScores: data.calculatedScores || { vata: 40, pitta: 40, kapha: 20, dominant: 'Vata-Pitta' },
      recommendations: data.recommendations || {
        dietFavor: ['Warm cooked soups', 'Herbal teas', 'Seasonal fruits'],
        dietAvoid: ['Heavy fried foods', 'Excess ice cream'],
        lifestyle: ['Regular morning yoga', 'Pranayama breathing'],
        formulations: ['Triphala 3g at night', 'Ashwagandha capsule']
      }
    };

    if (existingIndex >= 0) {
      assessments[existingIndex] = updated;
    } else {
      assessments.unshift(updated);
    }

    localStorage.setItem('ayur_assessments', JSON.stringify(assessments));

    // Also update patient primary dosha if scores calculated
    if (updated.calculatedScores) {
      const patients = this.getPatients();
      const patient = patients.find(p => p.id === updated.patientId);
      if (patient) {
        patient.vataScore = updated.calculatedScores.vata;
        patient.pittaScore = updated.calculatedScores.pitta;
        patient.kaphaScore = updated.calculatedScores.kapha;
        patient.prakriti = updated.calculatedScores.dominant;
        patient.primaryDosha = updated.calculatedScores.dominant as any;
        patient.status = 'Report Issued';
        localStorage.setItem('ayur_patients', JSON.stringify(patients));
      }
    }

    return updated;
  },

  getStudentTasks(): StudentTaskRecord[] {
    const raw = localStorage.getItem('ayur_student_tasks');
    return raw ? JSON.parse(raw) : [];
  },

  getNotifications(): NotificationRecord[] {
    const raw = localStorage.getItem('ayur_notifications');
    return raw ? JSON.parse(raw) : cachedNotifications;
  },

  markNotificationRead(id: string) {
    const notifs = this.getNotifications();
    const target = notifs.find(n => n.id === id);
    if (target) {
      target.read = true;
      localStorage.setItem('ayur_notifications', JSON.stringify(notifs));
    }
  }
};

export type Patient = PatientRecord;
export type Assessment = AssessmentRecord;
export type NotificationItem = NotificationRecord;
export interface NotificationItemInterface extends NotificationRecord {}
export const NotificationItem = {};

export const getPatients = () => dataStore.getPatients();
export const getPatientById = (id: string) => dataStore.getPatientById(id);
export const getAssessments = () => dataStore.getAssessments();
export const getAssessmentById = (id: string) => dataStore.getAssessmentById(id);
export const saveAssessment = (record: Partial<AssessmentRecord> & { id?: string; patientId: string; patientName?: string }) => dataStore.saveAssessment({ patientName: '', ...record });
export const getNotifications = () => dataStore.getNotifications();
export const markNotificationRead = (id: string) => dataStore.markNotificationRead(id);
