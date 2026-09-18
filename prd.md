AyurEssence — Complete Product Requirements Document (PRD)
Project: AyurEssence
Subtitle: Intelligent Ayurvedic Prakriti Assessment Platform
HPL 2026 — PS 01
Track: Backend — Week 1
Institution: SMVITM Bantakal × Code Troopers
Official Problem Sponsor: SDM College of Ayurveda, Udupi
Important: This PRD combines the official PS requirements with proposed product/technical decisions for your team. Wherever the official PS does not specify an exact implementation—for example, the exact scoring formula or technology—I will mark it as a team decision, not pretend it is an official requirement.
________________________________________
1. Product Vision
AyurEssence
AyurEssence is a practitioner-centered digital platform for systematic Ayurvedic Prakriti assessment.
It helps doctors and students:
Create Patient
      ↓
Start Assessment
      ↓
Conduct Questionnaire
      ↓
Record Practitioner Observations
      ↓
Calculate Vata / Pitta / Kapha
      ↓
Review Result
      ↓
Generate Report
      ↓
Track Previous Assessments
The official PS describes the objective as collecting questionnaire responses and practitioner observations and generating a clear, evidence-referenced Prakriti assessment report. 
Product principle
The practitioner remains at the center; AyurEssence assists rather than replaces professional judgment.
This is explicitly required by the PS. 
________________________________________
2. Problem Definition
Traditional Prakriti assessment requires the practitioner to consider a considerable amount of physical, physiological and behavioral information. This creates opportunities for:
•	repetitive manual questioning 
•	inconsistent recording 
•	difficulty maintaining historical records 
•	difficulty explaining how an assessment was derived 
•	difficulty standardizing assessments for students and institutions 
•	difficulty comparing previous assessments 
The official challenge is therefore to digitize and structure this assessment process while retaining practitioner involvement. 
________________________________________
3. Target Users
3.1 Doctor
Primary professional user.
Can:
•	register/login 
•	create/select patients 
•	start assessments 
•	administer questionnaires 
•	record responses 
•	add practitioner observations 
•	review Vata/Pitta/Kapha results 
•	view detailed reports 
•	view assessment history 
•	finalize assessments 
The doctor is the primary professional role in the official PS. 
________________________________________
3.2 Student
Used for:
•	learning 
•	practice 
•	supervised assessments 
Student functionality may be similar to the doctor's workflow, but the system distinguishes student-generated assessments from practitioner assessments. The exact authorization model is intentionally open to innovation. 
Proposed rule
Student
   ↓
Conduct Assessment
   ↓
Submit
   ↓
Doctor/Supervisor Review
   ↓
Finalize
________________________________________
3.3 Patient
The patient:
•	provides basic information 
•	participates in the assessment 
•	answers questions when required 
•	may view a simplified result if enabled 
The patient should not receive disease diagnosis, prescription or treatment decisions from AyurEssence. 
________________________________________
4. Product Scope
Core MVP
The mandatory product is:
Authentication
      ↓
Patient Management
      ↓
Assessment Management
      ↓
Questionnaire
      ↓
Responses
      ↓
Practitioner Observations
      ↓
Prakriti Calculation
      ↓
Result
      ↓
Report
      ↓
History
These correspond to the mandatory backend and prototype requirements in the PS. 
________________________________________
5. Core User Journey
Doctor Journey
LOGIN
  ↓
DASHBOARD
  ↓
PATIENTS
  ↓
SELECT / CREATE PATIENT
  ↓
START ASSESSMENT
  ↓
QUESTIONNAIRE
  ↓
PRACTITIONER OBSERVATIONS
  ↓
CALCULATE PRAKRITI
  ↓
REVIEW RESULT
  ↓
FINALIZE
  ↓
GENERATE REPORT
________________________________________
6. Assessment Lifecycle
I recommend defining the assessment as a state machine.
DRAFT
  │
  ↓
IN_PROGRESS
  │
  ↓
SUBMITTED
  │
  ↓
REVIEWED
  │
  ↓
FINALIZED
Proposed transition rules
DRAFT
  → IN_PROGRESS

IN_PROGRESS
  → SUBMITTED

SUBMITTED
  → REVIEWED

REVIEWED
  → FINALIZED
Critical rule
Once an assessment is FINALIZED, a student cannot modify it.
A doctor may have controlled correction/revision capability depending on your final authorization model.
This is a team design decision, not explicitly prescribed by the PS. It is useful because the Week 1 brief specifically gives the example that only a doctor should be able to finalize a report.
________________________________________
7. Questionnaire System
The platform needs a standardized baseline questionnaire.
The official PS expects coverage of:
•	physical characteristics 
•	body structure 
•	skin/hair characteristics 
•	appetite/digestion 
•	sleep patterns 
•	activity patterns 
•	behavioral characteristics 
•	physiological tendencies 
________________________________________
Questionnaire Structure
Proposed model:
Questionnaire
      │
      ├── Section
      │      │
      │      ├── Question
      │      │      ├── Option
      │      │      └── Dosha weights
      │      │
      │      └── Question
      │
      └── Section
Example:
Section: Physical Characteristics

Question:
"What best describes your body structure?"

Options:
A. Lean
B. Medium
C. Broad
The actual scoring relationships must come from the documented Ayurvedic methodology selected by the team.
Do not invent the scoring values.
________________________________________
8. Custom Questionnaire Capability
The system should be designed so that the baseline questionnaire isn't hard-coded into the application.
The PS encourages institutions/practitioners to eventually:
•	create questionnaires 
•	modify questionnaires 
•	import questionnaires 
•	configure questionnaires 
•	manage scoring rules 
•	maintain questionnaire versions 
Example
An administrator/institution could eventually create:
Standard Prakriti Assessment v1
and later:
Institution X Assessment v2
without modifying application source code.
________________________________________
9. Practitioner Observation Module
Questionnaires cannot capture everything a practitioner observes.
Therefore:
Assessment
     ↓
Practitioner Observation
     ↓
Free-form text
Example:
Patient appears to have a lean body structure, speaks quickly and reports irregular appetite.
The official PS explicitly requires free-form practitioner observations and mentions NLP as an optional enhancement. 
________________________________________
10. Optional NLP Layer
Do not make NLP a dependency for the basic system.
Proposed architecture:
Doctor's Note
     ↓
NLP Service
     ↓
Extracted Signals
     ↓
Doctor Review
     ↓
Assessment Engine
Example:
Input:

"Patient appears lean and speaks rapidly.
Reports irregular appetite."

             ↓ NLP

Possible signals:

Body structure → Lean
Speech pattern → Rapid
Appetite → Irregular

             ↓

Doctor confirms / rejects
The doctor should remain in control.
Why?
Because AI extracting something from a free-text note should not silently become an authoritative medical/Ayurvedic conclusion.
________________________________________
11. Prakriti Calculation Engine
This is the most important technical component.
Input:
Questionnaire Responses
        +
Practitioner-approved observations
        +
Selected Ayurvedic methodology
Output:
Vata: 45%
Pitta: 35%
Kapha: 20%

Dominant Dosha: Vata
The official PS provides exactly this type of output example. 
________________________________________
12. Calculation Engine Design
The calculation engine should be independent from the API layer.
FastAPI
   │
   ↓
Assessment Service
   │
   ↓
Calculation Engine
   │
   ├── Load methodology
   ├── Process responses
   ├── Apply scoring rules
   ├── Calculate proportions
   ├── Determine dominant Dosha
   └── Return result
Example API-level result
{
  "vata_percentage": 45,
  "pitta_percentage": 35,
  "kapha_percentage": 20,
  "dominant_dosha": "VATA",
  "methodology_id": "..."
}
________________________________________
13. Methodology Transparency
This is where I would make AyurEssence stronger than a generic questionnaire app.
The system should answer:
"Why did the system produce this result?"
Instead of:
Vata: 45%
show:
VATA — 45%

Primary contributing responses:
• Body structure
• Appetite pattern
• Sleep pattern
• Activity pattern

Practitioner observations:
• Lean body structure
• Rapid speech

Methodology:
[Selected Ayurvedic methodology]

References:
[Referenced sources]
The PS specifically requires transparency and references, and says scoring must not be treated as an arbitrary formula. 
________________________________________
14. Important Methodology Constraint
We currently should not write a specific Vata/Pitta/Kapha formula into the PRD unless your team has selected and verified the Ayurvedic reference/methodology.
The official specification tells you to reference an established methodology, but it does not provide the actual scoring formula. 
So our implementation should have a configurable structure:
Methodology
     ↓
Scoring Rules
     ↓
Question → Option → Dosha contribution
rather than hard-coding invented numbers.
________________________________________
15. Assessment Report
The report should contain:
Patient information
Name
Age
Gender
Contact
Assessment context
Assessment date
Practitioner
Student / Doctor
Methodology used
Prakriti breakdown
Vata     45%
Pitta    35%
Kapha    20%
Dominant constitution
Vata
Practitioner observations
Doctor's notes
Methodology
Assessment methodology
References
The official PS requires structured report data containing demographics, assessment context, Prakriti breakdown and observations. 
________________________________________
16. Doctor vs Patient Report
Doctor
Full report:
Patient details
Assessment details
All relevant responses
Dosha breakdown
Calculation basis
Observations
Methodology
References
History
Patient
Simplified:
Your Prakriti Assessment

Vata     45%
Pitta    35%
Kapha    20%

Dominant constitution:
Vata

[General constitutional summary]

Assessment is not a disease diagnosis.
The PS explicitly calls for different report visibility levels. 
________________________________________
17. Patient History
Each patient can have multiple assessments:
Rahul
 │
 ├── Assessment 01 — Jan
 │      Vata 40%
 │      Pitta 35%
 │      Kapha 25%
 │
 ├── Assessment 02 — Apr
 │      Vata 43%
 │      Pitta 34%
 │      Kapha 23%
 │
 └── Assessment 03 — Sep
        Vata 45%
        Pitta 35%
        Kapha 20%
The backend should provide:
GET /api/v1/patients/{patient_id}/history
The PS specifically requires historical assessment comparison and constitutional trend visualization as part of the broader platform scope. 
________________________________________
18. Database Design
Core entities
users
profiles
patients
assessments
questionnaires
questions
question_options
responses
observations
assessment_results
methodologies
methodology_references
reports
Main relationship
USER
 │
 ├───────────────┐
 ↓               ↓
PATIENT       ASSESSMENT
                 │
       ┌─────────┼─────────┐
       ↓         ↓         ↓
   RESPONSES OBSERVATIONS RESULT
       │                   │
       ↓                   ↓
   QUESTIONS          DOSHA VALUES

ASSESSMENT
     ↓
   REPORT
________________________________________
19. Recommended Technology Stack
Backend
Python + FastAPI
Why:
•	REST API development 
•	strong validation through Pydantic 
•	easy Python-based calculation engine 
•	easy future NLP/AI integration 
•	automatic OpenAPI documentation 
________________________________________
Database
Supabase PostgreSQL
Supabase
├── PostgreSQL
├── Authentication
└── Storage
This is your team's chosen implementation.
________________________________________
Authentication
Supabase Auth + JWT
Login
 ↓
Supabase Auth
 ↓
JWT
 ↓
FastAPI
 ↓
User identity + role
 ↓
Authorization
________________________________________
Frontend
For later weeks:
React + TypeScript
Responsive web application.
The PS does not require a native mobile application. A tablet-friendly responsive web interface is sufficient and actually aligns with the suggested clinical UX innovation. 
________________________________________
20. High-Level Architecture
                    AYURESSENCE
                         │
                         ▼
              ┌─────────────────────┐
              │  Web Client         │
              │ Doctor / Student /  │
              │ Patient             │
              └──────────┬──────────┘
                         │
                    HTTPS / REST
                         │
                         ▼
              ┌─────────────────────┐
              │   FastAPI Backend   │
              ├─────────────────────┤
              │ Auth & RBAC         │
              │ Patient Management  │
              │ Assessment Service  │
              │ Questionnaire       │
              │ Observation Service │
              │ Calculation Engine  │
              │ Report & History    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Supabase            │
              ├─────────────────────┤
              │ PostgreSQL          │
              │ Authentication      │
              │ Storage             │
              └─────────────────────┘

                 Optional later:

              ┌─────────────────────┐
              │ NLP / AI Service    │
              └──────────┬──────────┘
                         │
                         ▼
                Observation signals
________________________________________
21. API Structure
Use versioning from the beginning:
/api/v1/
Authentication
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
Patients
POST   /api/v1/patients
GET    /api/v1/patients
GET    /api/v1/patients/{id}
PATCH  /api/v1/patients/{id}
Assessments
POST  /api/v1/assessments
GET   /api/v1/assessments/{id}
PATCH /api/v1/assessments/{id}
POST  /api/v1/assessments/{id}/submit
POST  /api/v1/assessments/{id}/finalize
Questionnaires
GET    /api/v1/questionnaires
POST   /api/v1/questionnaires
GET    /api/v1/questionnaires/{id}
PATCH  /api/v1/questionnaires/{id}

POST   /api/v1/questions
PATCH  /api/v1/questions/{id}
DELETE /api/v1/questions/{id}
Responses
POST /api/v1/assessments/{id}/responses
GET  /api/v1/assessments/{id}/responses
Observations
POST /api/v1/assessments/{id}/observations
GET  /api/v1/assessments/{id}/observations
PATCH /api/v1/observations/{id}
Calculation
POST /api/v1/assessments/{id}/calculate
GET  /api/v1/assessments/{id}/result
Reports
GET /api/v1/assessments/{id}/report
History
GET /api/v1/patients/{id}/history
________________________________________
22. RBAC
Proposed authorization model:
Action	Doctor	Student	Patient
Login	✓	✓	✓
Create patient	✓	✓	✗
View assigned patient	✓	✓	Own
Create assessment	✓	✓	✗
Submit responses	✓	✓	✓*
Add observations	✓	✓	✗
Calculate assessment	✓	✓	✗
Finalize assessment	✓	✗	✗
View full report	✓	✓**	✗
View simplified result	✓	✓	Own
Manage questionnaire	✓	Restricted	✗
* depending on whether the patient directly answers through the chosen workflow.
** subject to your final student/supervisor permissions.
This needs to be implemented consistently in the backend rather than being only a frontend restriction.
________________________________________
23. Security Requirements
Authentication
All protected APIs require authentication.
Authorization
Every protected resource must check:
Is user authenticated?
        ↓
What is their role?
        ↓
Are they allowed to perform this action?
        ↓
Do they have access to THIS resource?
That last step is important.
A doctor shouldn't be able to access arbitrary patient records merely because they have the doctor role.
________________________________________
24. Data Protection
Patient information should be treated as sensitive application data.
Recommended:
•	HTTPS 
•	JWT-based authentication 
•	server-side authorization 
•	database constraints 
•	input validation 
•	no passwords stored directly by your application 
•	secrets stored in environment variables 
•	restricted Supabase service credentials 
•	audit information for important actions 
•	minimum necessary patient data 
________________________________________
25. Error Handling
Standard response:
{
  "success": false,
  "error": {
    "code": "ASSESSMENT_NOT_FOUND",
    "message": "Assessment does not exist"
  }
}
Use:
400 → Invalid input
401 → Unauthenticated
403 → Unauthorized
404 → Not found
409 → Conflict
500 → Internal server error
This follows the conventions specified in the Week 1 template. 
________________________________________
26. Important Business Rules
BR-01 — Patient ownership
Every assessment must belong to an existing patient.
BR-02 — Assessment ownership
Every assessment must have an associated practitioner/student.
BR-03 — Questionnaire validity
Responses must reference questions belonging to the questionnaire used by that assessment.
BR-04 — Required responses
An assessment cannot be submitted if mandatory questions remain unanswered.
BR-05 — Calculation
Only valid submitted assessment data can be calculated.
BR-06 — Methodology
Every calculated result must reference the Ayurvedic methodology used.
BR-07 — Finalization
Only an authorized doctor can finalize an assessment.
BR-08 — Finalized data
Finalized assessments cannot be modified by students.
BR-09 — Patient visibility
Patients only see information explicitly permitted for patient access.
BR-10 — No diagnosis
The platform must not generate disease diagnoses or treatment recommendations.
________________________________________
27. What AyurEssence Must NOT Do
This should be explicitly visible in your product requirements.
❌ Disease diagnosis
❌ Medicine prescription
❌ Automated treatment decisions
❌ Modern medical diagnosis
❌ Disease claims based solely on Prakriti
❌ Replace practitioner judgment
These are explicitly out of scope in the PS. 
________________________________________
28. Innovation Roadmap
Don't try to build everything immediately.
Phase 1 — Core
Auth
Patient
Assessment
Questionnaire
Responses
Observations
Calculation
Result
Report
History
This covers the mandatory foundation.
________________________________________
Phase 2 — Differentiation
Adaptive Questionnaire
Instead of asking every question:
Question 1
   ↓
Answer
   ↓
Determine most informative next question
   ↓
Question 2
   ↓
...
This is one of the official AI innovation opportunities. 
________________________________________
NLP Practitioner Assistant
Doctor note
     ↓
NLP
     ↓
Potential signals
     ↓
Doctor confirmation
     ↓
Assessment
________________________________________
Regional Languages
English
Kannada
Hindi
...
Regional-language support is explicitly encouraged. 
________________________________________
Assessment Analytics
Assessment 1
     ↓
Assessment 2
     ↓
Assessment 3
     ↓
Trend visualization
________________________________________
Questionnaire Builder
Allow institutions to:
Create questionnaire
       ↓
Add sections
       ↓
Add questions
       ↓
Add options
       ↓
Configure methodology/scoring
       ↓
Publish version
________________________________________
29. What Makes the Product Potentially Strong
The weak version of this project is:
Form
 ↓
Some arbitrary scores
 ↓
Pie chart
That will be easy for another team to reproduce.
A stronger version is:
Structured assessment
       +
Practitioner observations
       +
Documented methodology
       +
Explainable calculation
       +
Versioned questionnaires
       +
Assessment history
       +
Role-based workflows
       +
Student supervision
       +
AI assistance
The key differentiator I'd pursue is trust + explainability, not simply "we added AI."
________________________________________
30. HPL Development Strategy
Since HPL is iterative, structure development around increasing capability.
Week 1 — Backend Foundation
FastAPI
    ↓
Supabase
    ↓
Auth
    ↓
RBAC
    ↓
Patient
    ↓
Assessment
    ↓
Questionnaire
    ↓
Responses
    ↓
Observation
    ↓
Calculation
    ↓
Result
    ↓
Report API
This matches the current Evaluation 1 backend brief.
________________________________________
Week 2 — Product Layer
Add:
React frontend
      +
Doctor dashboard
      +
Student workflow
      +
Patient workflow
      +
Better questionnaire UX
      +
History visualization
________________________________________
Week 3 — Competitive Layer
Focus on:
Methodology transparency
        +
Adaptive assessment
        +
NLP assistance
        +
Regional language
        +
Performance
        +
Security
        +
UX polish
        +
Stress testing
________________________________________
31. Definition of Done — Backend
For the backend to be considered complete:
Authentication
•	Doctor registration/login 
•	Student registration/login 
•	Patient authentication/access model 
•	JWT verification 
•	Role enforcement 
Patient
•	Create patient 
•	View patient 
•	Update patient 
•	Patient-assessment relationship 
Questionnaire
•	Baseline questionnaire stored 
•	Questions retrievable through API 
•	Question CRUD 
•	Options stored 
•	Questionnaire version structure 
Assessment
•	Create assessment 
•	Save responses 
•	Save observations 
•	Assessment state management 
•	Submit/finalize workflow 
Calculation
•	Calculation engine implemented 
•	Vata percentage 
•	Pitta percentage 
•	Kapha percentage 
•	Dominant Dosha 
•	Methodology reference 
•	Explainable calculation basis 
Reports
•	Structured report data 
•	Doctor report 
•	Patient summary 
•	Assessment history 
Security
•	RBAC 
•	Resource ownership checks 
•	Input validation 
•	Protected APIs 
•	Consistent errors 
Testing
•	Authentication tests 
•	RBAC tests 
•	CRUD tests 
•	Assessment workflow tests 
•	Calculation tests 
•	Database relationship tests 
•	Invalid input tests 
•	Unauthorized access tests 
________________________________________
32. Final Product Architecture
The complete vision becomes:
                         AYURESSENCE
                              │
                    ┌─────────┴─────────┐
                    │                   │
                 DOCTOR              STUDENT
                    │                   │
                    └─────────┬─────────┘
                              │
                           PATIENT
                              │
                              ▼
                    RESPONSIVE WEB APP
                              │
                              ▼
                       HTTPS / REST
                              │
                              ▼
                    ┌─────────────────┐
                    │    FASTAPI      │
                    │    BACKEND      │
                    ├─────────────────┤
                    │ Auth & RBAC     │
                    │ Patients        │
                    │ Assessments     │
                    │ Questionnaires  │
                    │ Responses       │
                    │ Observations    │
                    │ Calculation     │
                    │ Reports         │
                    │ History         │
                    └────────┬────────┘
                             │
                    ┌────────┴─────────┐
                    │                  │
                    ▼                  ▼
             CALCULATION          OPTIONAL AI
                ENGINE              / NLP
                    │                  │
                    └────────┬─────────┘
                             ▼
                    ┌─────────────────┐
                    │    SUPABASE     │
                    ├─────────────────┤
                    │ PostgreSQL      │
                    │ Auth            │
                    │ Storage         │
                    └─────────────────┘

