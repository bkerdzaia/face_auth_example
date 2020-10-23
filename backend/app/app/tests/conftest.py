from typing import Generator

import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.base_class import Base
from app.api.deps import get_db


TEST_DB_NAME = './sql_app_test.db'


@pytest.fixture()
def db() -> Generator:
    engine = create_engine(f"sqlite:///{TEST_DB_NAME}", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    try:
        yield SessionLocal()
    finally:
        if os.path.exists(TEST_DB_NAME):
            os.remove(TEST_DB_NAME)


ClientSessionLocal = None

def override_get_db():
    try:
        db = ClientSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client() -> Generator:
    global ClientSessionLocal
    engine = create_engine(f"sqlite:///{TEST_DB_NAME}", connect_args={"check_same_thread": False})
    ClientSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    if os.path.exists(TEST_DB_NAME):
        os.remove(TEST_DB_NAME)


@pytest.fixture()
def img_file() -> Generator:
    with open('./app/tests/images/test_image.jpg', 'rb') as f:
        yield f
