def test_responses_and_submission_validation(client, doctor_headers):
    # 1. Create Assessment
    create_res = client.post("/api/assessments", json={
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333",
        "methodology_id": "11111111-1111-1111-1111-111111111111"
    }, headers=doctor_headers)
    ass_id = create_res.json()["id"]

    # 2. Advance to IN_PROGRESS
    client.patch(f"/api/assessments/{ass_id}", json={"status": "in_progress"}, headers=doctor_headers)

    # 3. Attempt to submit before answering required questions -> REJECTED 400
    res_sub_err = client.patch(f"/api/assessments/{ass_id}", json={"status": "submitted"}, headers=doctor_headers)
    assert res_sub_err.status_code == 400
    assert res_sub_err.json()["error"]["code"] == "BAD_REQUEST"

    # 4. Answer question 1
    resp1 = client.post(f"/api/assessments/{ass_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440001",
        "selected_option_id": "55555555-5555-5555-5555-555555550101"
    }, headers=doctor_headers)
    assert resp1.status_code == 201

    # 5. Answer question 2
    resp2 = client.post(f"/api/assessments/{ass_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440002",
        "selected_option_id": "55555555-5555-5555-5555-555555550201"
    }, headers=doctor_headers)
    assert resp2.status_code == 201

    # 6. Now submission should succeed -> 200
    res_sub_ok = client.patch(f"/api/assessments/{ass_id}", json={"status": "submitted"}, headers=doctor_headers)
    assert res_sub_ok.status_code == 200
    assert res_sub_ok.json()["status"] == "submitted"

def test_invalid_option_response(client, doctor_headers):
    create_res = client.post("/api/assessments", json={
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333",
        "methodology_id": "11111111-1111-1111-1111-111111111111"
    }, headers=doctor_headers)
    ass_id = create_res.json()["id"]

    # Submit invalid option ID
    res = client.post(f"/api/assessments/{ass_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440001",
        "selected_option_id": "99999999-9999-9999-9999-999999999999"
    }, headers=doctor_headers)
    assert res.status_code == 404
