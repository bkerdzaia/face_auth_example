from typing import IO

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate
from app.crud import user as user_crud
from app.core.face_encoding import encode as encode_face
from app.core.config import settings


def test_create_user(client: TestClient) -> None:
    r = client.post(f"{settings.API_STR}/users/", json={"name": "test", "password": "test"})
    result = r.json()
    assert r.status_code == 200
    assert 'access_token' in result
    assert result['access_token']


def test_read_users_me(client: TestClient) -> None:
    r = client.post(f"{settings.API_STR}/users/", json={"name": "test", "password": "test"})
    result = r.json()

    r = client.get(f"{settings.API_STR}/users/me", headers={'Authorization': f'Bearer {result["access_token"]}'})
    result = r.json()
    assert r.status_code == 200
    assert 'name' in result
    assert result['name']


def test_save_face(client: TestClient, img_file: IO) -> None:
    r = client.post(f"{settings.API_STR}/users/", json={"name": "test", "password": "test"})
    result = r.json()
    
    r = client.put(f"{settings.API_STR}/users/face", files={"file": img_file}, headers={'Authorization': f'Bearer {result["access_token"]}'})
    result = r.json()
    assert r.status_code == 200
    assert result['success'] == True
