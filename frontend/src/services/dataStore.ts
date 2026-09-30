// Centralized Dynamic Data Store & State Management for AyurEssence
// Syncs with localStorage and provides real-time CRUD APIs for all modules

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
  responses: Record<string, number>; // Question ID -> Dosha Score (1=Vata, 2=Pitta, 3=Kapha)
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

const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: 'AE-2041',
    name: 'Ananya Sharma',
    age: 34,
    gender: 'Female',
    phone: '+91 98450 12345',
    email: 'ananya.sharma@example.com',
    city: 'Udupi, Karnataka',
    prakriti: 'Vata-Pitta',
    primaryDosha: 'Vata-Pitta',
    vataScore: 48,
    pittaScore: 35,
    kaphaScore: 17,
    status: 'Report Issued',
    lastVisit: '2026-09-28',
    assignedDoctor: 'Dr. Suresh Bhat',
    assignedStudent: 'Rahul Verma',
    chiefComplaint: 'Mild insomnia, digestive irregularity, dryness of skin',
    medicalHistory: 'No chronic illness. Occasional hyperacidity.'
  },
  {
    id: 'AE-2042',
    name: 'Rajesh Hegde',
    age: 45,
    gender: 'Male',
    phone: '+91 97412 67890',
    email: 'rajesh.hegde@example.com',
    city: 'Mangaluru, Karnataka',
    prakriti: 'Pitta-Kapha',
    primaryDosha: 'Pitta-Kapha',
    vataScore: 20,
    pittaScore: 52,
    kaphaScore: 28,
    status: 'Active',
    lastVisit: '2026-09-29',
    assignedDoctor: 'Dr. Suresh Bhat',
    assignedStudent: 'Priya K',
    chiefComplaint: 'Heat sensitivity, joint stiffness in morning, acid reflux',
    medicalHistory: 'Hypertension managed with Ayurvedic herbs.'
  },
  {
    id: 'AE-2043',
    name: 'Meera Kulkarni',
    age: 28,
    gender: 'Female',
    phone: '+91 94801 11223',
    email: 'meera.k@example.com',
    city: 'Bengaluru, Karnataka',
    prakriti: 'Kapha-Vata',
    primaryDosha: 'Kapha-Vata',
    vataScore: 32,
    pittaScore: 18,
    kaphaScore: 50,
    status: 'Follow-up Scheduled',
    lastVisit: '2026-09-25',
    assignedDoctor: 'Dr. Suresh Bhat',
    assignedStudent: 'Rahul Verma',
    chiefComplaint: 'Lethargy, weight gain, sluggish metabolism',
    medicalHistory: 'Hypothyroidism.'
  },
  {
    id: 'AE-2044',
    name: 'Vikramaditya Rao',
    age: 52,
    gender: 'Male',
    phone: '+91 99002 33445',
    email: 'vikram.rao@example.com',
    city: 'Shivamogga, Karnataka',
    prakriti: 'Vata',
    primaryDosha: 'Vata',
    vataScore: 65,
    pittaScore: 22,
    kaphaScore: 13,
    status: 'Under Assessment',
    lastVisit: '2026-09-29',
    assignedDoctor: 'Dr. Suresh Bhat',
    chiefComplaint: 'Lower back ache, dry joints, anxiety',
    medicalHistory: 'Vata Vyadhi predisposition.'
  }
];

const INITIAL_ASSESSMENTS: AssessmentRecord[] = [
  {
    id: 'ASM-1001',
    patientId: 'AE-2041',
    patientName: 'Ananya Sharma',
    evaluatorRole: 'doctor',
    evaluatorName: 'Dr. Suresh Bhat',
    status: 'Finalized',
    date: '2026-09-28',
    responses: { q1: 1, q2: 2, q3: 1, q4: 2, q5: 1, q6: 3, q7: 1, q8: 2, q9: 1, q10: 2 },
    observation: {
      nadiGati: 'Sarpa (Snake)',
      nadiRate: 78,
      jihva: 'Uncoated (Nirama)',
      twak: 'Cool & Dry',
      netra: 'Clear & Bright',
      agni: 'Vishamagni'
    },
    calculatedScores: {
      vata: 48,
      pitta: 35,
      kapha: 17,
      dominant: 'Vata-Pitta'
    },
    recommendations: {
      dietFavor: ['Warm cooked grains (rice, quinoa)', 'Ghee & sesame oil', 'Sweet & ripe fruits', 'Warm spiced milk with nutmeg'],
      dietAvoid: ['Raw cold salads', 'Pungent chili peppers', 'Iced beverages', 'Dry snacks & crackers'],
      lifestyle: ['Daily warm sesame oil Abhyanga massage', 'Regular sleep schedule (sleep by 10:00 PM)', 'Gentle Nadi Shodhana Pranayama'],
      formulations: ['Ashwagandha Churna 3g twice daily', 'Triphala Churna 5g at bedtime', 'Dhanwantharam Thailam for external use']
    }
  }
];

const INITIAL_STUDENT_TASKS: StudentTaskRecord[] = [
  {
    id: 'TSK-501',
    studentName: 'Rahul Verma',
    patientId: 'AE-2041',
    patientName: 'Ananya Sharma',
    assessmentId: 'ASM-1001',
    status: 'Completed',
    submittedDate: '2026-09-27',
    studentScores: { vata: 46, pitta: 36, kapha: 18 },
    doctorScores: { vata: 48, pitta: 35, kapha: 17 },
    accuracyScore: 94.5,
    mentorFeedback: 'Excellent clinical precision in Nadi Gati observation. Good identification of Vishamagni patterns.',
    mentorGrade: 'A+'
  },
  {
    id: 'TSK-502',
    studentName: 'Rahul Verma',
    patientId: 'AE-2042',
    patientName: 'Rajesh Hegde',
    assessmentId: 'ASM-1002',
    status: 'Submitted',
    submittedDate: '2026-09-29',
    studentScores: { vata: 22, pitta: 50, kapha: 28 },
    doctorScores: { vata: 20, pitta: 52, kapha: 28 },
    accuracyScore: 92.0,
    mentorFeedback: 'Awaiting mentor final sign-off.',
    mentorGrade: 'A'
  }
];

const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'NOTIF-1',
    title: 'New Prakriti Assessment Completed',
    message: 'Assessment for Ananya Sharma (AE-2041) was finalized.',
    time: '2 hours ago',
    type: 'assessment',
    read: false,
    link: '/doctor/assessments/ASM-1001/result'
  },
  {
    id: 'NOTIF-2',
    title: 'Student Evaluation Submitted',
    message: 'Rahul Verma submitted clinical Prakriti analysis for Rajesh Hegde.',
    time: '5 hours ago',
    type: 'assessment',
    read: false,
    link: '/student/assessments/ASM-1002/comparison'
  },
  {
    id: 'NOTIF-3',
    title: 'Follow-up Reminder',
    message: 'Scheduled follow-up for Meera Kulkarni (AE-2043) on Oct 2.',
    time: '1 day ago',
    type: 'followup',
    read: true,
    link: '/doctor/follow-ups'
  }
];

export const dataStore = {
  getPatients(): PatientRecord[] {
    const raw = localStorage.getItem('ayur_patients');
    if (!raw) {
      localStorage.setItem('ayur_patients', JSON.stringify(INITIAL_PATIENTS));
      return INITIAL_PATIENTS;
    }
    return JSON.parse(raw);
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
    return newPatient;
  },

  getAssessments(): AssessmentRecord[] {
    const raw = localStorage.getItem('ayur_assessments');
    if (!raw) {
      localStorage.setItem('ayur_assessments', JSON.stringify(INITIAL_ASSESSMENTS));
      return INITIAL_ASSESSMENTS;
    }
    return JSON.parse(raw);
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
    if (!raw) {
      localStorage.setItem('ayur_student_tasks', JSON.stringify(INITIAL_STUDENT_TASKS));
      return INITIAL_STUDENT_TASKS;
    }
    return JSON.parse(raw);
  },

  getNotifications(): NotificationRecord[] {
    const raw = localStorage.getItem('ayur_notifications');
    if (!raw) {
      localStorage.setItem('ayur_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
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


