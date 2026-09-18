def test_finalization_immutability(client, doctor_headers, student_headers):
    # 1. Create & complete assessment responses
    create_res = client.post("/api/assessments", json={
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333",
        "methodology_id": "11111111-1111-1111-1111-111111111111"
    }, headers=doctor_headers)
    ass_id = create_res.json()["id"]

    client.post(f"/api/assessments/{ass_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440001",
        "selected_option_id": "55555555-5555-5555-5555-555555550101"
    }, headers=doctor_headers)

    client.post(f"/api/assessments/{ass_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440002",
        "selected_option_id": "55555555-5555-5555-5555-555555550201"
    }, headers=doctor_headers)

    # 2. Advance state: DRAFT -> IN_PROGRESS -> SUBMITTED -> REVIEWED
    client.patch(f"/api/assessments/{ass_id}", json={"status": "submitted"}, headers=doctor_headers)
    client.patch(f"/api/assessments/{ass_id}", json={"status": "reviewed"}, headers=doctor_headers)

    # 3. Doctor finalizes -> SUCCESS
    fin_res = client.patch(f"/api/assessments/{ass_id}", json={"status": "finalized"}, headers=doctor_headers)
    assert fin_res.status_code == 200
    assert fin_res.json()["status"] == "finalized"
    assert fin_res.json()["finalized_at"] is not None

    # 4. Attempt post-finalization response update -> REJECTED 409
    resp_mod = client.post(f"/api/assessments/{ass_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440001",
        "selected_option_id": "55555555-5555-5555-5555-555555550102"
    }, headers=doctor_headers)
    assert resp_mod.status_code == 409
    assert resp_mod.json()["error"]["code"] == "INVALID_STATE"

    # 5. Attempt post-finalization observation -> REJECTED 409
    obs_mod = client.post(f"/api/assessments/{ass_id}/observations", json={
        "notes": "Late clinical note"
    }, headers=doctor_headers)
    assert obs_mod.status_code == 409
    assert obs_mod.json()["error"]["code"] == "INVALID_STATE"

    # 6. Attempt post-finalization recalculation -> REJECTED 409
    calc_mod = client.post(f"/api/assessments/{ass_id}/calculate", headers=doctor_headers)
    assert calc_mod.status_code == 409
    assert calc_mod.json()["error"]["code"] == "INVALID_STATE"
