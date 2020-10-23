from typing import IO
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate
from app.crud import user as user_crud
from app.core.face_encoding import encode as encode_face


def test_create_user(db: Session) -> None:
    user = UserCreate(name="test", password="test")
    user_db = user_crud.create_user(db, user)
    assert user.name == user_db.name
    assert hasattr(user_db, "hashed_password")


def test_authenticate_user(db: Session) -> None:
    user = UserCreate(name="test", password="test")
    user_db = user_crud.create_user(db, user)
    user_auth = user_crud.authenticate_user(db, user.name, user.password)
    assert user_auth
    assert user_auth.name == user_db.name


def test_no_authenticate_user(db: Session) -> None:
    user = user_crud.authenticate_user(db, "no_user", "123")
    assert not user


def test_authenticate_face_detection(db: Session, img_file: IO) -> None:
    encodings = encode_face(img_file)
    assert encodings

    user_create = UserCreate(name="test", password="test")
    user_db = user_crud.create_user(db, user_create)
    user_db.encodings = encodings
    db.commit()
    db.refresh(user_db)
    user = user_crud.authenticate_face_detection(db, img_file)
    assert user
    assert user.name == user_db.name


def test_no_authenticate_face_detection(db: Session, img_file: IO) -> None:
    user = user_crud.authenticate_face_detection(db, img_file)
    assert not user


def test_get_user(db: Session) -> None:
    user = UserCreate(name="test", password="test")
    user_db = user_crud.create_user(db, user)
    user_2 = user_crud.get_user(db, user_db.name)
    assert user_2
    assert user_2.name == user_db.name


def test_get_users_with_encodings(db: Session) -> None:
    user = UserCreate(name="test", password="test")
    user_db = user_crud.create_user(db, user)
    user_with_encodings = user_crud.get_users_with_encodings(db)
    assert len(user_with_encodings) == 0
    user_db.encodings = b"123"
    db.commit()
    db.refresh(user_db)
    user_with_encodings = user_crud.get_users_with_encodings(db)
    assert len(user_with_encodings) == 1
    assert user_with_encodings[0].encodings == b"123"
