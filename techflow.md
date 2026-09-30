AyurEssence — Complete App Flow
Normal User Flow + Technical System Flow

This combines the user-facing navigation with the backend/API/data flow, so you can use it directly for your App Flow document, presentation, or development.

1. Complete High-Level Flow
                    ┌──────────────────────┐
                    │      LANDING PAGE    │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │   LOGIN / REGISTER   │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ AUTHENTICATION       │
                    │ + ROLE IDENTIFICATION│
                    └──────────┬───────────┘
                               ↓
             ┌─────────────────┼─────────────────┐
             ↓                 ↓                 ↓
        👨‍⚕️ DOCTOR          🎓 STUDENT         👤 PATIENT
             │                 │                 │
             ↓                 ↓                 ↓
        Dashboard         Dashboard          Dashboard
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ↓
                     PATIENT / ASSESSMENT
                               ↓
                         QUESTIONNAIRE
                               ↓
                    PRACTITIONER OBSERVATION
                               ↓
                         SUBMIT ASSESSMENT
                               ↓
                     PRAKRITI CALCULATION
                               ↓
                       ASSESSMENT RESULT
                               ↓
                         DOCTOR REVIEW
                               ↓
                  ┌────────────┴─────────────┐
                  ↓                          ↓
          APPROVED RESULT             RECOMMENDATION
                                             ↓
                                      DOCTOR APPROVAL
                                             ↓
                                      DIGITAL REPORT
                                             ↓
                                  SECURE REPORT SHARING
                                             ↓
                                      FOLLOW-UP
                                             ↓
                                  FUTURE ASSESSMENT
                                             ↓
                                    PATIENT TIMELINE
2. LANDING PAGE FLOW
Normal User Flow
Landing Page
    ↓
Understand AyurEssence
    ↓
Explore Features
    ├── For Doctors
    ├── For Students
    └── For Patients
    ↓
How It Works
    ↓
Get Started
    ↓
Login / Register
Landing Page Sections
Hero
 ↓
About AyurEssence
 ↓
For Doctors
 ↓
For Students
 ↓
For Patients
 ↓
How It Works
 ↓
Continuous Patient Journey
 ↓
Human-in-the-Loop Intelligence
 ↓
Final CTA
 ↓
Footer
3. AUTHENTICATION FLOW
Normal
User
 ↓
Login / Register
 ↓
Enter Credentials
 ↓
Authentication
 ↓
Account Valid?
 ├── No → Show Error
 │
 └── Yes
       ↓
     User Profile
       ↓
     Check Role
       ↓
 ┌─────┼─────┐
 ↓     ↓     ↓
Doctor Student Patient
Technical
Frontend
   ↓
POST /api/auth/login
   ↓
Supabase Auth
   ↓
JWT Access Token
   ↓
Backend validates JWT
   ↓
Fetch profile / role
   ↓
RBAC middleware
   ↓
Role-based dashboard

The backend remains the final authorization authority; frontend route guards are not sufficient by themselves.

4. DOCTOR FLOW
Normal User Flow
Doctor Login
     ↓
Doctor Dashboard
     ↓
Patient List
     ↓
Select Patient
     ↓
Patient Details
     ↓
Start New Assessment
     ↓
Select Questionnaire
     ↓
Complete Questionnaire
     ↓
Record Practitioner Observation
     ↓
Submit Assessment
     ↓
Calculate Prakriti
     ↓
View Result
     ↓
Doctor Review
     ↓
Finalize Assessment
     ↓
Generate Recommendation Draft
     ↓
Review / Modify Recommendation
     ↓
Approve Recommendation
     ↓
Generate Digital Report
     ↓
Share Report
     ↓
Schedule Follow-up
5. DOCTOR TECHNICAL FLOW
Doctor Dashboard
       ↓
GET /api/patients
       ↓
Patient List
       ↓
GET /api/patients/{patient_id}
       ↓
Patient Details
       ↓
POST /api/assessments
       ↓
Assessment Created
       ↓
GET /api/questionnaires/{questionnaire_id}
       ↓
Questionnaire Loaded
       ↓
POST /api/assessments/{assessment_id}/responses
       ↓
Responses Stored
       ↓
POST /api/assessments/{assessment_id}/observations
       ↓
Observations Stored
       ↓
POST /api/assessments/{assessment_id}/calculate
       ↓
Calculation Engine
       ↓
Assessment Result
       ↓
GET /api/assessments/{assessment_id}/result
       ↓
Doctor Review
       ↓
POST /api/assessments/{assessment_id}/finalize
       ↓
Assessment FINALIZED
       ↓
Recommendation Draft
       ↓
Doctor Approval
       ↓
Report Generation
       ↓
Secure Share / Follow-up
6. PATIENT MANAGEMENT FLOW
Doctor
 ↓
Patient List
 ↓
Add Patient
 ↓
Enter Patient Information
 ↓
Validate Data
 ↓
Create Patient
 ↓
Patient Profile
Technical
POST /api/patients
       ↓
Pydantic Validation
       ↓
RBAC Check
       ↓
Patient Service
       ↓
PostgreSQL / Supabase
       ↓
Patient Created

Patient information can include the configured baseline fields and, in the updated backend design, baseline dominant Dosha and primary methodology.

7. ASSESSMENT FLOW
Normal
Select Patient
     ↓
Select Questionnaire
     ↓
Start Assessment
     ↓
Assessment Created
     ↓
Answer Questions
     ↓
Save Responses
     ↓
Practitioner Observation
     ↓
Review
     ↓
Submit
Technical State Machine
DRAFT
  ↓
IN_PROGRESS
  ↓
SUBMITTED
  ↓
REVIEWED
  ↓
FINALIZED
  ↓
READ-ONLY
Important Rule

Once finalized:

FINALIZED
   ↓
No normal modification
   ↓
Read-only assessment
8. QUESTIONNAIRE FLOW
Normal
Assessment
   ↓
Questionnaire
   ↓
Question 1
   ↓
Question 2
   ↓
Question 3
   ↓
...
   ↓
Final Question
   ↓
Review Answers
   ↓
Submit
Technical
Assessment
   ↓
Questionnaire ID
   ↓
Questions
   ↓
Question Options
   ↓
User Response
   ↓
Response Validation
   ↓
Response Storage

Responses can capture the configured score snapshot fields, including:

Vata Score
Pitta Score
Kapha Score

and support the configured multi-choice/selected-options representation.

9. PRACTITIONER OBSERVATION FLOW
Assessment
    ↓
Practitioner Observation
    ↓
Doctor / Student enters notes
    ↓
Validate
    ↓
Save Observation
    ↓
Attach to Assessment

Technical:

POST /api/assessments/{assessment_id}/observations
              ↓
        Observation Service
              ↓
          Database
10. PRAKRITI CALCULATION FLOW

This is the core technical processing flow.

Submitted Assessment
        ↓
Validate Required Responses
        ↓
Load Methodology
        ↓
Load Question Scoring
        ↓
Process Responses
        ↓
Calculate Vata
        ↓
Calculate Pitta
        ↓
Calculate Kapha
        ↓
Normalize Percentages
        ↓
Determine Dominant Dosha
        ↓
Store Calculation Version
        ↓
Create Assessment Result
Technical Architecture
Assessment
     ↓
Responses
     ↓
Calculation Service
     ↓
Calculation Engine
     ↓
Vata / Pitta / Kapha
     ↓
Normalized Result
     ↓
assessment_results

The calculation engine should use the configured documented/reference methodology. The system should not invent a medical scoring methodology.

11. RESULT FLOW
Calculation Complete
       ↓
Assessment Result
       ↓
┌───────────────────────────┐
│ Vata      XX%             │
│ Pitta     XX%             │
│ Kapha     XX%             │
│                           │
│ Dominant Dosha            │
└───────────────────────────┘
       ↓
Doctor Review
       ↓
Finalize

Technical result includes the calculation version so that the methodology used for the result remains traceable.

12. DOCTOR FINALIZATION FLOW
Assessment Result
       ↓
Doctor Reviews
       ↓
Everything Valid?
   ┌───┴────┐
   ↓        ↓
  No       Yes
   ↓        ↓
Modify    Finalize
             ↓
       FINALIZED
             ↓
       Read-Only

Only the authorized Doctor role can perform finalization according to the backend rules.

13. RECOMMENDATION FLOW

This is the Human-in-the-Loop workflow.

Final / Reviewed Assessment
          ↓
System Generates Draft
          ↓
Recommendation = DRAFT
          ↓
Doctor Reviews
          ↓
Doctor Modifies if Required
          ↓
Doctor Approves
          ↓
Recommendation = APPROVED
          ↓
Patient Can View
Technical concept
Assessment
    ↓
Recommendation Service
    ↓
Draft Recommendation
    ↓
Doctor Review
    ↓
Approval
    ↓
Patient-facing Recommendation

The system should never bypass the Doctor approval step for patient-facing recommendations.

14. REPORT FLOW
Normal
Finalized Assessment
       ↓
Generate Report
       ↓
Choose:
 ├── Doctor Full Report
 └── Patient Summary
       ↓
Report Preview
       ↓
Save Report
       ↓
Doctor Views / Shares
Technical
Assessment
     ↓
Report Service
     ↓
Generate Structured Report Data
     ↓
reports table
     ↓
Report ID
     ↓
Report Preview
15. SECURE REPORT SHARING
Doctor
  ↓
Select Finalized Report
  ↓
Share Report
  ↓
Generate Temporary Access Token
  ↓
Share Link / Access
  ├── WhatsApp
  ├── Email
  └── SMS
  ↓
Recipient Opens Link
  ↓
Token Validation
  ↓
Report Access
Security
Valid Token
    ↓
Temporary Access
    ↓
Report

Invalid / Expired Token
    ↓
Access Denied

The design should avoid exposing unrestricted database URLs or direct database records.

16. PATIENT FLOW
Normal
Patient Login
      ↓
Patient Dashboard
      ↓
My Assessment
      ↓
Complete Questionnaire
      ↓
Submit
      ↓
Doctor Review
      ↓
Final Result
      ↓
Approved Recommendation
      ↓
Digital Report
      ↓
Follow-up
      ↓
Patient Timeline
17. PATIENT TECHNICAL FLOW
Patient Login
     ↓
JWT Authentication
     ↓
Patient RBAC
     ↓
Own Patient Resource
     ↓
Assessment
     ↓
Responses
     ↓
Calculation
     ↓
Doctor Review
     ↓
Final Result
     ↓
Approved Recommendation
     ↓
Report
     ↓
Timeline

Patient access must remain restricted to permitted own records/resources.

18. PATIENT TIMELINE

The platform is not intended to treat each assessment as an isolated event.

PATIENT
   │
   ├── Assessment 01
   │      ├── Responses
   │      ├── Observation
   │      ├── Result
   │      └── Report
   │
   ├── Follow-up
   │
   ├── Assessment 02
   │      ├── Responses
   │      ├── Observation
   │      ├── Result
   │      └── Report
   │
   └── Assessment 03
          ├── Responses
          ├── Observation
          ├── Result
          └── Report
Timeline API
GET /api/patients/{patient_id}/timeline

The timeline provides the longitudinal patient journey.

19. FOLLOW-UP FLOW
Assessment Finalized
       ↓
Doctor Schedules Follow-up
       ↓
Reminder Created
       ↓
PENDING
       ↓
Scheduled Date/Time
       ↓
Reminder Sent
       ↓
SENT
       ↓
Patient Returns
       ↓
New Assessment
       ↓
Timeline Updated

Possible reminder states:

PENDING
   ├──→ SENT
   │
   └──→ CANCELLED

Possible channels include the configured:

In-App
Email
SMS
WhatsApp
20. STUDENT FLOW
Normal
Student Login
      ↓
Student Dashboard
      ↓
Accessible / Assigned Patient
      ↓
Patient Details
      ↓
Create Assessment
      ↓
Questionnaire
      ↓
Observation
      ↓
Submit
      ↓
Prakriti Calculation
      ↓
Student Interpretation
      ↓
Doctor Review
      ↓
Student vs Doctor Comparison
      ↓
Mentor Feedback
      ↓
Student Analytics
21. STUDENT TECHNICAL FLOW
Student
   ↓
Authentication
   ↓
RBAC
   ↓
Permitted Patient / Assessment
   ↓
Assessment Service
   ↓
Questionnaire
   ↓
Responses
   ↓
Observation
   ↓
Calculation
   ↓
Student Interpretation
   ↓
Doctor Review
   ↓
Comparison
   ↓
Mentor Feedback
   ↓
Analytics

Student permissions do not include final assessment authorization or independent patient-facing recommendation approval.

22. STUDENT VS DOCTOR COMPARISON
Student Interpretation
        │
        │
        ↓
   ┌───────────┐
   │ Comparison │
   └─────┬─────┘
         │
   ┌─────┴─────────┐
   ↓               ↓
Student          Doctor
Interpretation   Verified Result
   │               │
   └───────┬───────┘
           ↓
      Difference
           ↓
      Mentor Feedback

Example UI:

Student Interpretation
Vata   35%
Pitta  40%
Kapha  25%

          VS

Doctor Verified Result
Vata   40%
Pitta  35%
Kapha  25%
23. MENTOR FEEDBACK FLOW
Student Assessment
       ↓
Doctor Review
       ↓
Doctor Provides Feedback
       ↓
Select Feedback Type
       ├── Positive
       ├── Warning
       ├── Tip
       └── Correction
       ↓
Student Views Feedback
       ↓
Learning History
24. STUDENT ANALYTICS
Student Dashboard
       ↓
Analytics
       ↓
┌───────────────────────────┐
│ Total Assessments         │
│ Doctor Reviewed           │
│ Pending Review             │
│ Feedback Received          │
└───────────────────────────┘

These are descriptive learning/activity metrics, not an automatic competence ranking.

25. COMPLETE TECHNICAL ARCHITECTURE FLOW
                 FRONTEND
                    │
          React / TypeScript
                    │
                    ↓
             HTTPS / REST API
                    │
                    ↓
               FASTAPI
                    │
        ┌───────────┼────────────┐
        ↓           ↓            ↓
      Auth       RBAC        Validation
        │           │            │
        └───────────┼────────────┘
                    ↓
             Business Services
                    │
 ┌──────────────────┼─────────────────────┐
 ↓                  ↓                     ↓
Patients       Assessments          Questionnaires
 ↓                  ↓                     ↓
Timeline       Responses            Questions
 ↓                  ↓                     ↓
Follow-ups     Observations         Scoring
                    │
                    ↓
             Calculation Engine
                    │
                    ↓
              Assessment Result
                    │
          ┌─────────┼───────────┐
          ↓         ↓           ↓
   Recommendations Reports    Education
          │         │           │
          ↓         ↓           ↓
       Approval   Sharing    Feedback
                    │
                    ↓
              PostgreSQL
               Supabase
26. DATABASE FLOW
Supabase Auth
      ↓
profiles
      ↓
patients
      ↓
questionnaires
      ↓
questions
      ↓
question_options
      ↓
assessments
      ↓
responses
      ↓
observations
      ↓
assessment_results
      ↓
reports

Updated architecture also accounts for:

patients
   ↓
baseline_dominant_dosha
primary_methodology_id

responses
   ↓
score snapshots
Vata / Pitta / Kapha

assessment
   ↓
methodology derived from questionnaire

The broader Phase 2 architecture also includes concepts for recommendations, report-share tokens, reminders, student interpretations, and mentor feedback.

27. SECURITY FLOW

Every protected request follows:

User
 ↓
JWT
 ↓
Authentication
 ↓
Is Token Valid?
 ├── No → 401
 │
 └── Yes
       ↓
     Role Check
       ↓
     Resource Check
       ↓
 ┌─────┴─────┐
 ↓           ↓
Allowed     Denied
 ↓           ↓
Process     403
Request
Security Layers
Authentication
      ↓
JWT Validation
      ↓
RBAC
      ↓
Resource Ownership / Assignment
      ↓
Pydantic Validation
      ↓
Database Constraints / Access Controls
      ↓
Business Rules
28. ERROR FLOW
User Action
    ↓
API Request
    ↓
Validation
    ↓
Business Logic
    ↓
Database

If something fails:

Validation Failure
       → 422

Unauthenticated
       → 401

Unauthorized
       → 403

Resource Not Found
       → 404

Business Rule Conflict
       → 409

Unexpected Server Error
       → 500

The frontend displays an understandable message and provides retry/navigation where appropriate.

29. EDGE-CASE FLOW
Expired Login
API Request
 ↓
JWT Expired
 ↓
401
 ↓
Clear Session
 ↓
Login
Unauthorized Patient
User Requests Patient
 ↓
Resource Check
 ↓
Not Allowed
 ↓
403
 ↓
Access Denied
Incomplete Questionnaire
Submit
 ↓
Required Question Missing
 ↓
Submission Blocked
 ↓
Highlight Missing Question
 ↓
User Completes
 ↓
Submit Again
Finalized Assessment
Edit Assessment
 ↓
State = FINALIZED
 ↓
Modification Blocked
 ↓
Read-Only View
Expired Shared Report
Open Shared Report
 ↓
Token Validation
 ↓
Expired
 ↓
Access Denied
30. FINAL COMPLETE USER JOURNEY
                         AYURESSENCE
                              │
                              ↓
                       LANDING PAGE
                              │
                              ↓
                       LOGIN / REGISTER
                              │
                              ↓
                       AUTHENTICATION
                              │
                              ↓
                         ROLE CHECK
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ↓                   ↓                   ↓
       DOCTOR              STUDENT             PATIENT
          │                   │                   │
          ↓                   ↓                   ↓
      Dashboard           Dashboard           Dashboard
          │                   │                   │
          ↓                   ↓                   ↓
      Patients          Accessible Patients    My Assessment
          │                   │                   │
          ↓                   ↓                   ↓
   Patient Details       Assessment             Questionnaire
          │                   │                   │
          └──────────────┬────┴───────────────────┘
                         ↓
                   QUESTIONNAIRE
                         ↓
                    RESPONSES
                         ↓
                  PRACTITIONER
                   OBSERVATION
                         ↓
                      SUBMIT
                         ↓
               PRAKRITI CALCULATION
                         ↓
                 VATA / PITTA / KAPHA
                         ↓
                 ASSESSMENT RESULT
                         ↓
                    DOCTOR REVIEW
                         ↓
                    FINALIZATION
                         ↓
                 ┌───────┴────────┐
                 ↓                ↓
              RESULT        RECOMMENDATION
                                  ↓
                           DOCTOR APPROVAL
                                  ↓
                           DIGITAL REPORT
                                  ↓
                         SECURE REPORT SHARE
                                  ↓
                            FOLLOW-UP
                                  ↓
                         FUTURE ASSESSMENT
                                  ↓
                         PATIENT TIMELINE
                                  ↓
                     CONTINUOUS JOURNEY
In one sentence

AyurEssence takes a user from Landing → Authentication → Role-based Dashboard → Patient/Assessment → Questionnaire → Observation → Prakriti Calculation → Result → Doctor Review → Doctor-approved Recommendation → Digital Report → Secure Sharing → Follow-up → Future Assessment → Longitudinal Patient Timeline, with a separate supervised Student learning and mentor-feedback flow.