from fastapi.testclient import TestClient
from src.app.main import app

client = TestClient(app)

def test_get_user():
    response = client.get("auth/user/1")
    assert response.status_code == 200