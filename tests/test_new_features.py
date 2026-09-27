def test_recommendation_and_approval_flow(client, doctor_headers, student_headers):
    # 1. Create assessment
    ass_res = client.post("/api/assessments", json={
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333"
    }, headers=doctor_headers)
    ass_id = ass_res.json()["id"]

    # Calculate
    client.post(f"/api/assessments/{ass_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440001",
        "selected_option_id": "55555555-5555-5555-5555-555555550101"
    }, headers=doctor_headers)
    client.post(f"/api/assessments/{ass_id}/calculate", headers=doctor_headers)

    # 2. Generate Draft Recommendation
    draft_res = client.post(f"/api/recommendations/assessment/{ass_id}/draft", headers=doctor_headers)
    assert draft_res.status_code == 201
    rec_data = draft_res.json()
    assert rec_data["status"] == "draft"
    rec_id = rec_data["id"]

    # 3. Doctor Approves Recommendation (Human-in-the-loop)
    appr_res = client.patch(f"/api/recommendations/{rec_id}/approve", json={
        "approved_text": "Reviewed by Dr. Sharma. Recommended 4-week follow-up and Pitta soothing diet.",
        "recommended_followup_weeks": 4
    }, headers=doctor_headers)
    assert appr_res.status_code == 200
    assert appr_res.json()["status"] == "approved"
    assert "Dr. Sharma" in appr_res.json()["approved_text"]

def test_followup_reminders(client, doctor_headers):
    # Create assessment dynamically
    ass_res = client.post("/api/assessments", json={
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333"
    }, headers=doctor_headers)
    ass_id = ass_res.json()["id"]

    rem_res = client.post("/api/reminders", json={
        "assessment_id": ass_id,
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "scheduled_date": "2026-10-15",
        "channel": "whatsapp",
        "notes": "Prakriti follow-up review"
    }, headers=doctor_headers)
    assert rem_res.status_code == 201
    assert rem_res.json()["channel"] == "whatsapp"
    assert rem_res.json()["status"] == "pending"

def test_reports_and_secure_sharing(client, doctor_headers):
    # Create assessment dynamically
    ass_res = client.post("/api/assessments", json={
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333"
    }, headers=doctor_headers)
    ass_id = ass_res.json()["id"]

    # Generate doctor full report
    rep_res = client.post(f"/api/reports/assessment/{ass_id}", json={
        "report_type": "doctor_full"
    }, headers=doctor_headers)
    assert rep_res.status_code == 201
    report_id = rep_res.json()["id"]

    # Generate secure share token link
    share_res = client.post(f"/api/reports/{report_id}/share", json={
        "channel": "email",
        "recipient": "patient@example.com",
        "expires_in_hours": 24
    }, headers=doctor_headers)
    assert share_res.status_code == 201
    token = share_res.json()["token"]
    assert share_res.json()["share_url"] == f"/api/reports/shared/{token}"

    # Access shared report via token
    access_res = client.get(f"/api/reports/shared/{token}")
    assert access_res.status_code == 200
    assert "Practitioner Full Clinical Prakriti Report" in access_res.json()["header"]

def test_patient_health_timeline(client, doctor_headers):
    timeline_res = client.get("/api/patients/00000000-0000-0000-0000-000000000003/timeline", headers=doctor_headers)
    assert timeline_res.status_code == 200
    assert isinstance(timeline_res.json(), list)

def test_educational_module(client, doctor_headers, student_headers):
    # Create assessment dynamically
    ass_res = client.post("/api/assessments", json={
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333"
    }, headers=doctor_headers)
    ass_id = ass_res.json()["id"]

    # 1. Doctor leaves mentor feedback for student
    fb_res = client.post("/api/educational/feedback", json={
        "assessment_id": ass_id,
        "student_id": "00000000-0000-0000-0000-000000000002",
        "feedback_type": "positive",
        "notes": "Good observation of Vata skin characteristics."
    }, headers=doctor_headers)
    assert fb_res.status_code == 201
    assert fb_res.json()["feedback_type"] == "positive"

    # 2. Get student learning analytics
    analytics_res = client.get("/api/educational/analytics/00000000-0000-0000-0000-000000000002", headers=doctor_headers)
    assert analytics_res.status_code == 200
    assert analytics_res.json()["feedback_received_count"] >= 1

    # 3. Compare student vs doctor interpretation
    compare_res = client.get(f"/api/educational/compare/{ass_id}", headers=doctor_headers)
    assert compare_res.status_code == 200
