from sqlalchemy import Integer, String, LargeBinary, Column

from app.db.base_class import Base


class User(Base):
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    encodings = Column(LargeBinary)
