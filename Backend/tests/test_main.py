<<<<<<< HEAD
import pytest
import random
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport  # lifespan="on" supported here
from src.app.main import app

random_number = random.randint(100000, 999999)
user_id = None  # Global variable to store user ID

@pytest.fixture(scope="session")
def transport():
    return ASGITransport(app=app)


@pytest.mark.asyncio
async def test_create_user(transport):
    global user_id
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/auth/make_user",
            json={
                "user_name": f"testuser{random_number}",
                "email": f"testuser{random_number}@example.com",
                "password": "Securepassword1"
            }
        )
        assert response.status_code == 200

        data = await response.json()
        user_id = data["id"]
        assert user_id is not None

        # Use that ID to fetch the user
        get_response = await client.get(f"/auth/user/{user_id}")
        assert get_response.status_code == 200


@pytest.mark.asyncio
async def test_get_user(transport):
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/auth/user/{user_id}")
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_update_user(transport):
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.put(
            "/auth/user/update/{user_id}",
            json={
                "user_name": "Secret1234",
                "email": "updateduser@example.com",
                "password": "Secret1234"
            }
        )
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_create_audio(transport):
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/auth/audio/create/{user_id}",
            json={
                "audio_name": "testaudio",
                "file_path": "/path/to/audio/file.mp3"
            }
        )
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_get_audios(transport):
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/auth/audio/get_audios/{user_id}")
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_update_audio(transport):
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.put(
            "/auth/audio/update/{user_id}",
            json={
                "audio_name": "updatedaudio",
                "file_path": "/path/to/updated/audio/file.mp3"
            }
        )
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_delete_audio(transport):
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.delete("/auth/audio/delete/{user_id}")
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_request_new_verification_code(transport):
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.put("/auth/user/verify/newcoderequest/{user_id}")
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_login(transport):
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/auth/token",
            data={
                "username": f"testuser{random_number}",
                "password": "Securepassword1"
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 200
=======
import random
import string
import requests

BASE_URL = "http://127.0.0.1:8000/auth"

def generate_random_user():
    username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    email = f"{username}@test.com"
    password = "password123"
    return {
        "user_name": username,
        "email": email,
        "password": password
    }
def register_user(user_data):
    response = requests.post(f"{BASE_URL}/make_user", json=user_data)
    assert response.status_code == 200, f"Failed to register user: {response.json()}"
    return response.json()

def test_user_creation():
    user_data = generate_random_user()
    register_user(user_data)

def test_user_verification():
    user_data = generate_random_user()
    register_user(user_data)


def test_user_exists():
    user_data = generate_random_user()
    register_user(user_data)

    response = requests.get(f"{BASE_URL}/user/exists", params={"username": user_data["user_name"]})
    assert response.status_code == 200, f"Failed to check user existence: {response.json()}"
    assert response.json()["exists"] is True
def test_token_get_audio():
    user_data = generate_random_user()
    # Register the user first to ensure they exist
    register_user(user_data)

    # Get the token using form data with the correct content type
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(
        f"{BASE_URL}/token", 
        data={"username": user_data["user_name"], "password": user_data["password"]},
        headers=headers
    )
    
    assert response.status_code == 200, f"Failed to get token: {response.content}"
    token1 = response.json()["access_token"]
    
    # Pass the token in the "token" header
    headers = {"token": token1}
    
    # Get the audio data using the token header
    response = requests.get(f"{BASE_URL}/audio/get_audios", headers=headers)
    assert response.status_code == 200, f"Failed to get audio data: {response.content}"

def test_delete_user_token():
        user_data = generate_random_user()
        register_user(user_data)
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = requests.post(
        f"{BASE_URL}/token", 
        data={"username": user_data["user_name"], "password": user_data["password"]},
        headers=headers)
        assert response.status_code == 200, f"Failed to get token: {response.content}"
        token1 = response.json()["access_token"]
        # Pass the token in the "token" header
        headers = {"token": token1}
        response = requests.delete(f"{BASE_URL}/user/delete", headers=headers)
        assert response.status_code == 200, "Failed to delete"
>>>>>>> main
