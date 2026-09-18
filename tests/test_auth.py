def test_register_and_login_flow(client):
    # 1. Register new Doctor
    reg_payload = {
        "email": "newdoctor@ayur.com",
        "password": "securepassword123",
        "full_name": "Dr. New Doctor",
        "role": "doctor",
        "phone": "+91-9999999999"
    }
    res_reg = client.post("/api/auth/register", json=reg_payload)
    assert res_reg.status_code == 201
    data_reg = res_reg.json()
    assert "access_token" in data_reg
    assert data_reg["profile"]["full_name"] == "Dr. New Doctor"
    assert data_reg["profile"]["role"] == "doctor"

    # 2. Login with valid credentials
    login_payload = {
        "email": "newdoctor@ayur.com",
        "password": "securepassword123"
    }
    res_login = client.post("/api/auth/login", json=login_payload)
    assert res_login.status_code == 200
    data_login = res_login.json()
    assert "access_token" in data_login
    token = data_login["access_token"]

    # 3. Access GET /api/auth/me with valid JWT
    res_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    assert res_me.json()["full_name"] == "Dr. New Doctor"

def test_invalid_login(client):
    res = client.post("/api/auth/login", json={"email": "nonexistent@test.com", "password": "wrongpassword"})
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "UNAUTHENTICATED"

def test_missing_jwt(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "UNAUTHENTICATED"

def test_invalid_jwt(client):
    res = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid.jwt.token"})
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "UNAUTHENTICATED"
