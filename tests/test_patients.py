def test_patient_crud_flow(client, doctor_headers):
    # 1. Create Patient
    payload = {
        "full_name": "Rohan Sharma",
        "date_of_birth": "1992-05-15",
        "gender": "Male",
        "phone": "+91-9876500000",
        "email": "rohan.sharma@example.com",
        "address": "123 Green Avenue, Delhi"
    }
    res_create = client.post("/api/patients", json=payload, headers=doctor_headers)
    assert res_create.status_code == 201
    p_data = res_create.json()
    patient_id = p_data["id"]
    assert p_data["full_name"] == "Rohan Sharma"

    # 2. Retrieve Patient
    res_get = client.get(f"/api/patients/{patient_id}", headers=doctor_headers)
    assert res_get.status_code == 200
    assert res_get.json()["email"] == "rohan.sharma@example.com"

    # 3. Update Patient
    res_update = client.patch(f"/api/patients/{patient_id}", json={"phone": "+91-9999911111"}, headers=doctor_headers)
    assert res_update.status_code == 200
    assert res_update.json()["phone"] == "+91-9999911111"

def test_invalid_patient_id(client, doctor_headers):
    # Invalid UUID format
    res = client.get("/api/patients/invalid-uuid-123", headers=doctor_headers)
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "BAD_REQUEST"

    # Nonexistent UUID
    res404 = client.get("/api/patients/99999999-9999-9999-9999-999999999999", headers=doctor_headers)
    assert res404.status_code == 404
    assert res404.json()["error"]["code"] == "RESOURCE_NOT_FOUND"
