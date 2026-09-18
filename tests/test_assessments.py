def test_assessment_creation_and_state_machine(client, doctor_headers):
    # 1. Create Assessment
    payload = {
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333",
        "methodology_id": "11111111-1111-1111-1111-111111111111"
    }
    res = client.post("/api/assessments", json=payload, headers=doctor_headers)
    assert res.status_code == 201
    ass_data = res.json()
    ass_id = ass_data["id"]
    assert ass_data["status"] == "draft"

    # 2. Invalid state transition: DRAFT -> FINALIZED directly must be rejected with 409 Conflict
    res_invalid = client.patch(f"/api/assessments/{ass_id}", json={"status": "finalized"}, headers=doctor_headers)
    assert res_invalid.status_code == 409
    assert res_invalid.json()["error"]["code"] == "INVALID_STATE"

    # 3. Valid transition: DRAFT -> IN_PROGRESS
    res_prog = client.patch(f"/api/assessments/{ass_id}", json={"status": "in_progress"}, headers=doctor_headers)
    assert res_prog.status_code == 200
    assert res_prog.json()["status"] == "in_progress"

def test_assessment_invalid_references(client, doctor_headers):
    # Invalid patient ID
    payload = {
        "patient_id": "99999999-9999-9999-9999-999999999999",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333",
        "methodology_id": "11111111-1111-1111-1111-111111111111"
    }
    res = client.post("/api/assessments", json=payload, headers=doctor_headers)
    assert res.status_code == 404
