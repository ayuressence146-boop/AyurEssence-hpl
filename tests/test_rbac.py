def test_patient_cannot_create_patient(client, patient_headers):
    payload = {
        "full_name": "Unauthorized Patient Creation Attempt",
        "email": "unauth@test.com"
    }
    res = client.post("/api/patients", json=payload, headers=patient_headers)
    assert res.status_code == 403
    assert res.json()["error"]["code"] == "UNAUTHORIZED"

def test_patient_cannot_create_assessment(client, patient_headers):
    payload = {
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333",
        "methodology_id": "11111111-1111-1111-1111-111111111111"
    }
    res = client.post("/api/assessments", json=payload, headers=patient_headers)
    assert res.status_code == 403

def test_student_cannot_finalize_assessment(client, student_headers, doctor_headers):
    # 1. Doctor creates assessment
    create_res = client.post("/api/assessments", json={
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333",
        "methodology_id": "11111111-1111-1111-1111-111111111111"
    }, headers=doctor_headers)
    assert create_res.status_code == 201
    assessment_id = create_res.json()["id"]

    # 2. Advance state: DRAFT -> IN_PROGRESS -> SUBMITTED (after answering questions) -> REVIEWED
    client.post(f"/api/assessments/{assessment_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440001",
        "selected_option_id": "55555555-5555-5555-5555-555555550101"
    }, headers=doctor_headers)
    client.post(f"/api/assessments/{assessment_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440002",
        "selected_option_id": "55555555-5555-5555-5555-555555550201"
    }, headers=doctor_headers)

    client.patch(f"/api/assessments/{assessment_id}", json={"status": "submitted"}, headers=doctor_headers)
    client.patch(f"/api/assessments/{assessment_id}", json={"status": "reviewed"}, headers=doctor_headers)

    # 3. Student attempts to finalize -> REJECTED
    res_stu = client.patch(f"/api/assessments/{assessment_id}", json={"status": "finalized"}, headers=student_headers)
    assert res_stu.status_code == 403

    # 4. Doctor finalizes -> SUCCESS
    res_doc = client.patch(f"/api/assessments/{assessment_id}", json={"status": "finalized"}, headers=doctor_headers)
    assert res_doc.status_code == 200
    assert res_doc.json()["status"] == "finalized"
