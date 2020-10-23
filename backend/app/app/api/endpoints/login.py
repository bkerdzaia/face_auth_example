from typing import Optional, Any

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt
import face_recognition

from app import schemas
from app.api import deps
from app.core.security import create_access_token
from app.crud import user as user_crud
from app.schemas.token import Token


router = APIRouter()

@router.post("/access-token", response_model=Token)
def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(deps.get_db)
) -> Any:
    user = user_crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(user.name)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/face-access-token", response_model=Token)
def face_authorize_access_token(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db)
) -> Any:
    user = user_crud.authenticate_face_detection(db, file.file)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    access_token = create_access_token(user.name)
    return {"access_token": access_token, "token_type": "bearer"}
