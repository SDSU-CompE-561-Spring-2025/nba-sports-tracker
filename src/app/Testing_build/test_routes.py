from fastapi import APIRouter, Depends
from pydantic import BaseModel, constr, EmailStr, Field
from app.Testing_build.db_grabber import Base, get_db
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Session
router = APIRouter()


dummy_id = 1


class A_Route_Inputs(BaseModel):
    name: constr(min_length=5, max_length=20)
    last_name: constr(min_length=5, max_length=20)


class DB_Test_Save(Base):

    __tablename__ = "test_table"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    last_name = Column(String, unique=True, index=True)

    #categories = relationship("Category", back_populates="test")
    #__tablename__ = "users"

    #id = Column(Integer, primary_key=True, index=True)
    #username = Column(String, unique=True, index=True)
    #email = Column(String, unique=True, index=True)
    #password_hash = Column(String)
    #is_active = Column(Boolean, default=True)
    #is_verified = Column(Boolean, default=True)
    #verification_code = Column(String, nullable=True)
    #created_at = Column(DateTime, default=datetime.now(UTC))

    #categories = relationship("Category", back_populates="user")


class Return_A_Route():
    name_r = ""
    last_name_r = ""
    def __init__(self, param1, param2):
        self.last_name_r = param1
        self.name_r = param2


@router.post("/a_route")
def user(test_input: A_Route_Inputs, db : Session = Depends(get_db)):
    return_value = Return_A_Route(test_input.name + "10", test_input.last_name + "10")
    global dummy_id
    db_test = DB_Test_Save(
        id = dummy_id,
        name = test_input.name,
        last_name = test_input.last_name
    )
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    dummy_id += 1
    #return_value.name_r = test_input.name + "10"
    #return_value.last_name_r = test_input.last_name + "10"
    return db_test

@router.get("/get_test")
def get_last_name(name: String)
    
