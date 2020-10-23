from typing import Optional, Any

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
import face_recognition

from app.api import deps
from app.core.security import create_access_token
from app.core.face_encoding import encode as encode_face
from app.schemas.token import Token
from app.schemas.user import UserCreate, User
from app.crud import user as crud


router = APIRouter()


@router.post("/", response_model=Token)
def create_user(
    user: UserCreate,
    db: Session = Depends(deps.get_db)
) -> Any:
    db_user = crud.get_user(db, user.name)
    if db_user:
        raise HTTPException(status_code=400, detail="Name already registered")
    created_user = crud.create_user(db, user)
    access_token = create_access_token(created_user.name)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
def read_users_me(
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    return current_user


@router.put("/face")
def save_face(
    file: UploadFile = File(...),
    user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
) -> Any:
    img_encodings = encode_face(file.file)
    if not img_encodings:
        return {'success': False}
    user_db = crud.get_user(db, user.name)
    user_db.encodings = img_encodings
    db.commit()
    return {'success': True}
