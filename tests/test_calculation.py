def test_prakriti_calculation_engine(client, doctor_headers):
    # 1. Create Assessment
    create_res = client.post("/api/assessments", json={
        "patient_id": "00000000-0000-0000-0000-000000000003",
        "questionnaire_id": "33333333-3333-3333-3333-333333333333",
        "methodology_id": "11111111-1111-1111-1111-111111111111"
    }, headers=doctor_headers)
    ass_id = create_res.json()["id"]

    # 2. Add Responses: Both Vata options (opt1_1 vata=1.0, opt2_1 vata=1.0)
    client.post(f"/api/assessments/{ass_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440001",
        "selected_option_id": "55555555-5555-5555-5555-555555550101"
    }, headers=doctor_headers)

    client.post(f"/api/assessments/{ass_id}/responses", json={
        "question_id": "44444444-4444-4444-4444-444444440002",
        "selected_option_id": "55555555-5555-5555-5555-555555550201"
    }, headers=doctor_headers)

    # 3. Trigger Calculation
    calc_res = client.post(f"/api/assessments/{ass_id}/calculate", headers=doctor_headers)
    assert calc_res.status_code == 200
    res_data = calc_res.json()

    assert res_data["vata_percentage"] == 100.0
    assert res_data["pitta_percentage"] == 0.0
    assert res_data["kapha_percentage"] == 0.0
    assert res_data["dominant_dosha"] == "Vata"
    assert res_data["calculation_version"] == "1.0.0"
    assert (res_data["vata_percentage"] + res_data["pitta_percentage"] + res_data["kapha_percentage"]) == 100.0

    # 4. Retrieve stored result via GET /api/assessments/{assessment_id}/result
    get_res = client.get(f"/api/assessments/{ass_id}/result", headers=doctor_headers)
    assert get_res.status_code == 200
    assert get_res.json()["dominant_dosha"] == "Vata"
