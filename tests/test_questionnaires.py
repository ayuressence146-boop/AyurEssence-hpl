def test_get_questionnaires(client, doctor_headers):
    # List active questionnaires
    res_list = client.get("/api/questionnaires", headers=doctor_headers)
    assert res_list.status_code == 200
    q_list = res_list.json()
    assert len(q_list) >= 1
    q_id = q_list[0]["id"]

    # Get specific questionnaire details
    res_detail = client.get(f"/api/questionnaires/{q_id}", headers=doctor_headers)
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert "questions" in detail
    assert len(detail["questions"]) == 2
    assert "options" in detail["questions"][0]
