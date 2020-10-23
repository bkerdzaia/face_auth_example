from typing import Optional, List, IO

from sqlalchemy.orm import Session

import numpy as np
from fastapi import UploadFile

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.face_encoding import compare as compare_faces


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user(db: Session, name: str) -> Optional[User]:
    return db.query(User).filter(User.name == name).first()


def get_users(db: Session) -> List[User]:
    return db.query(User).all()


def get_users_with_encodings(db: Session) -> List[User]:
    return db.query(User).filter(User.encodings.isnot(None)).all()


def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(name=user.name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def authenticate_face_detection(db: Session, file: IO) -> Optional[User]:
    users = get_users_with_encodings(db)
    known_faces = list(map(lambda u: np.frombuffer(u.encodings), users))
    results = compare_faces(file, known_faces)
    if not results or not True in results:
        return False
    indx = results.index(True)
    return users[indx]
