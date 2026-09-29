import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Landing
import Landing from './pages/landing/Landing';
import Splash from './pages/landing/Splash';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoleSelect from './pages/auth/RoleSelect';
import ForgotPassword from './pages/auth/ForgotPassword';

// Doctor
import DoctorDashboard from './pages/doctor/Dashboard';
import PatientList from './pages/doctor/PatientList';
import AddPatient from './pages/doctor/AddPatient';
import DoctorPatientDetails from './pages/doctor/PatientDetails';
import DoctorPatientTimeline from './pages/doctor/PatientTimeline';
import CreateAssessment from './pages/doctor/CreateAssessment';
import DoctorQuestionnaire from './pages/doctor/Questionnaire';
import PractitionerObservation from './pages/doctor/PractitionerObservation';
import DoctorAssessmentResult from './pages/doctor/AssessmentResult';
import RecommendationReview from './pages/doctor/RecommendationReview';
import ReportGeneration from './pages/doctor/ReportGeneration';
import ReportPreview from './pages/doctor/ReportPreview';
import FollowUpManagement from './pages/doctor/FollowUpManagement';

// Student
import StudentDashboard from './pages/student/Dashboard';
import AssignedAssessments from './pages/student/AssignedAssessments';
import StudentPatientDetails from './pages/student/StudentPatientDetails';
import StudentAssessment from './pages/student/StudentAssessment';
import StudentInterpretation from './pages/student/StudentInterpretation';
import DoctorComparison from './pages/student/DoctorComparison';
import MentorFeedback from './pages/student/MentorFeedback';
import StudentAnalytics from './pages/student/StudentAnalytics';

// Patient
import PatientDashboard from './pages/patient/Dashboard';
import MyAssessment from './pages/patient/MyAssessment';
import PatientQuestionnaire from './pages/patient/Questionnaire';
import PrakritiResult from './pages/patient/PrakritiResult';
import MyRecommendation from './pages/patient/MyRecommendation';
import MyReports from './pages/patient/MyReports';
import PatientTimeline from './pages/patient/PatientTimeline';

// Common
import Profile from './pages/common/Profile';
import Notifications from './pages/common/Notifications';
import Settings from './pages/common/Settings';
import AccessDenied from './pages/common/AccessDenied';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/unauthorized" element={<AccessDenied />} />
          
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="/auth/select-role" replace />} />
            <Route path="select-role" element={<RoleSelect />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route path="/doctor" element={<DashboardLayout role="doctor" />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="patients/add" element={<AddPatient />} />
            <Route path="patients/:id" element={<DoctorPatientDetails />} />
            <Route path="patients/:id/timeline" element={<DoctorPatientTimeline />} />
            <Route path="assessments/create" element={<CreateAssessment />} />
            <Route path="assessments/:id/questionnaire" element={<DoctorQuestionnaire />} />
            <Route path="assessments/:id/observation" element={<PractitionerObservation />} />
            <Route path="assessments/:id/result" element={<DoctorAssessmentResult />} />
            <Route path="assessments/:id/recommendation" element={<RecommendationReview />} />
            <Route path="reports/generate" element={<ReportGeneration />} />
            <Route path="reports/:id/preview" element={<ReportPreview />} />
            <Route path="follow-ups" element={<FollowUpManagement />} />
            
            {/* Common routes available to doctor */}
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="/patient" element={<DashboardLayout role="patient" />}>
            <Route index element={<PatientDashboard />} />
            <Route path="assessment" element={<MyAssessment />} />
            <Route path="assessment/questionnaire" element={<PatientQuestionnaire />} />
            <Route path="result" element={<PrakritiResult />} />
            <Route path="recommendation" element={<MyRecommendation />} />
            <Route path="reports" element={<MyReports />} />
            <Route path="timeline" element={<PatientTimeline />} />
            
            {/* Common routes available to patient */}
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/student" element={<DashboardLayout role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="tasks" element={<AssignedAssessments />} />
            <Route path="patients/:id" element={<StudentPatientDetails />} />
            <Route path="assessments/conduct" element={<StudentAssessment />} />
            <Route path="assessments/:id/interpretation" element={<StudentInterpretation />} />
            <Route path="assessments/:id/comparison" element={<DoctorComparison />} />
            <Route path="feedback" element={<MentorFeedback />} />
            <Route path="analytics" element={<StudentAnalytics />} />
            
            {/* Common routes available to student */}
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
