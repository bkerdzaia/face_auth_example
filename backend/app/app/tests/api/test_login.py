from typing import IO

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate
from app.crud import user as user_crud
from app.core.face_encoding import encode as encode_face
from app.core.config import settings


def test_login_access_token(client: TestClient, db: Session) -> None:
    user = UserCreate(name="test", password="test")
    user_db = user_crud.create_user(db, user)
    r = client.post(f"{settings.API_STR}/login/access-token", data={"username": "test", "password": "test"})
    result = r.json()
    assert r.status_code == 200
    assert 'access_token' in result
    assert result['access_token']


def test_face_authorize_access_token(client: TestClient, db: Session, img_file: IO) -> None:
    encodings = encode_face(img_file)
    user_create = UserCreate(name="test", password="test")
    user_db = user_crud.create_user(db, user_create)
    user_db.encodings = encodings
    db.commit()
    db.refresh(user_db)
    img_file.seek(0)
    r = client.post(f"{settings.API_STR}/login/face-access-token", files={'file': img_file})
    result = r.json()
    assert r.status_code == 200
    assert 'access_token' in result
    assert result['access_token']



def test_face_authorize_access_token_no_user(client: TestClient, img_file: IO) -> None:
    r = client.post(f"{settings.API_STR}/login/face-access-token", files={"file": img_file})
    assert r.status_code == 401
