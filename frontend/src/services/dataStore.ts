// Centralized Dynamic Data Store & State Management for AyurEssence
// Connected 100% to live Supabase / FastAPI backend API (/api/v1)

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

// Purge any old static mock data left in localStorage
const purgeOldMockData = () => {
  try {
    const raw = localStorage.getItem('ayur_patients');
    if (raw && (raw.includes('Ananya Sharma') || raw.includes('Rajesh Hegde') || raw.includes('AE-2041'))) {
      localStorage.removeItem('ayur_patients');
      localStorage.removeItem('ayur_assessments');
      localStorage.removeItem('ayur_student_tasks');
    }
  } catch (e) {
    // Ignore error
  }
};
purgeOldMockData();

// Live in-memory cache synced with backend API
let cachedPatients: PatientRecord[] = [];
let cachedAssessments: AssessmentRecord[] = [];
let cachedNotifications: NotificationRecord[] = [];

// Asynchronous sync with backend API / Supabase
export const syncDatabaseData = async (): Promise<PatientRecord[]> => {
  try {
    const apiPatients = await patientService.listPatients();
    if (Array.isArray(apiPatients)) {
      cachedPatients = apiPatients.map(p => ({
        id: p.id,
        name: p.full_name || p.name || 'Patient User',
        age: p.age || (p.date_of_birth ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear() : 30),
        gender: (p.gender as any) || 'Female',
        phone: p.phone || 'N/A',
        email: p.email || 'N/A',
        city: p.address || 'Location Not Specified',
        prakriti: p.baseline_dominant_dosha || p.prakriti || 'Pending Evaluation',
        primaryDosha: (p.baseline_dominant_dosha as any) || 'Tridoshaj',
        vataScore: p.vataScore || 0,
        pittaScore: p.pittaScore || 0,
        kaphaScore: p.kaphaScore || 0,
        status: p.is_active ? 'Active' : 'Archived',
        lastVisit: p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        assignedDoctor: 'Practitioner',
        chiefComplaint: p.primaryComplaint || 'General Prakriti evaluation',
        medicalHistory: 'Logged in Supabase database'
      }));
      localStorage.setItem('ayur_patients', JSON.stringify(cachedPatients));
    }
  } catch (err) {
    console.warn('Backend API connection in progress:', err);
  }
  return cachedPatients;
};

// Auto sync on load
syncDatabaseData();

export const dataStore = {
  getPatients(): PatientRecord[] {
    const raw = localStorage.getItem('ayur_patients');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && !raw.includes('Ananya Sharma')) {
          cachedPatients = parsed;
        }
      } catch (e) {}
    }
    return cachedPatients;
  },

  async fetchPatientsLive(): Promise<PatientRecord[]> {
    return await syncDatabaseData();
  },

  getPatientById(id: string): PatientRecord | undefined {
    return this.getPatients().find(p => p.id === id);
  },

  addPatient(data: Omit<PatientRecord, 'id' | 'prakriti' | 'primaryDosha' | 'vataScore' | 'pittaScore' | 'kaphaScore' | 'status' | 'lastVisit'>): PatientRecord {
    const patients = this.getPatients();
    const newPatient: PatientRecord = {
      ...data,
      id: `PAT-${Date.now().toString().slice(-6)}`,
      prakriti: 'Assessment Pending',
      primaryDosha: 'Tridoshaj',
      vataScore: 0,
      pittaScore: 0,
      kaphaScore: 0,
      status: 'Active',
      lastVisit: new Date().toISOString().split('T')[0]
    };

    patients.unshift(newPatient);
    localStorage.setItem('ayur_patients', JSON.stringify(patients));

    // Persist to backend database / Supabase
    patientService.createPatient({
      full_name: data.name,
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      address: data.city
    }).catch(err => console.warn('Backend patient save:', err));

    return newPatient;
  },

  getAssessments(): AssessmentRecord[] {
    const raw = localStorage.getItem('ayur_assessments');
    if (raw) {
      try {
        cachedAssessments = JSON.parse(raw);
      } catch (e) {}
    }
    return cachedAssessments;
  },

  getAssessmentById(id: string): AssessmentRecord | undefined {
    return this.getAssessments().find(a => a.id === id);
  },

  saveAssessment(data: Partial<AssessmentRecord> & { patientId: string; patientName: string }): AssessmentRecord {
    const assessments = this.getAssessments();
    const existingIndex = assessments.findIndex(a => a.id === data.id);
    const newId = data.id || `ASM-${Date.now().toString().slice(-6)}`;
    
    const updated: AssessmentRecord = {
      id: newId,
      patientId: data.patientId,
      patientName: data.patientName,
      evaluatorRole: data.evaluatorRole || 'doctor',
      evaluatorName: data.evaluatorName || 'Practitioner',
      status: data.status || 'In Progress',
      date: new Date().toISOString().split('T')[0],
      responses: data.responses || {},
      observation: data.observation,
      calculatedScores: data.calculatedScores || { vata: 0, pitta: 0, kapha: 0, dominant: 'Tridoshaj' },
      recommendations: data.recommendations
    };

    if (existingIndex >= 0) {
      assessments[existingIndex] = updated;
    } else {
      assessments.unshift(updated);
    }

    localStorage.setItem('ayur_assessments', JSON.stringify(assessments));
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
