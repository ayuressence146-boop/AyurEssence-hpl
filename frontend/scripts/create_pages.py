import os

pages = {
    "landing": ["Landing.tsx", "Splash.tsx"],
    "auth": ["ForgotPassword.tsx"], # Login and Register already exist
    "doctor": [
        "PatientList.tsx", "AddPatient.tsx", "PatientDetails.tsx", "PatientTimeline.tsx",
        "CreateAssessment.tsx", "Questionnaire.tsx", "PractitionerObservation.tsx",
        "AssessmentResult.tsx", "RecommendationReview.tsx", "ReportGeneration.tsx",
        "ReportPreview.tsx", "FollowUpManagement.tsx"
    ],
    "student": [
        "AssignedAssessments.tsx", "StudentPatientDetails.tsx", "StudentAssessment.tsx",
        "StudentInterpretation.tsx", "DoctorComparison.tsx", "MentorFeedback.tsx",
        "StudentAnalytics.tsx"
    ],
    "patient": [
        "MyAssessment.tsx", "Questionnaire.tsx", "PrakritiResult.tsx",
        "MyRecommendation.tsx", "MyReports.tsx", "PatientTimeline.tsx"
    ],
    "common": [
        "Profile.tsx", "Notifications.tsx", "Settings.tsx", "AccessDenied.tsx"
    ]
}

base_dir = "d:/project by sujal/AyurEssence/frontend/src/pages"

template = """import React from 'react';

const {name} = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-serif text-[var(--color-primary)] font-bold">{name}</h1>
      <p className="text-gray-500 mt-2">This is the {name} page.</p>
    </div>
  );
};

export default {name};
"""

for folder, files in pages.items():
    folder_path = os.path.join(base_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    for file in files:
        file_path = os.path.join(folder_path, file)
        if not os.path.exists(file_path):
            name = file.replace(".tsx", "")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(template.replace("{name}", name))

print("Scaffolding complete!")
