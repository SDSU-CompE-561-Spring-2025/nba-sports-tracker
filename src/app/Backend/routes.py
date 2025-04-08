from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, constr, EmailStr, Field
from app.Backend.db_grabber import Base, get_db
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Session
import time
from passlib.context import CryptContext
router = APIRouter()

class A_Route_Inputs(BaseModel):
    name: constr(min_length=5, max_length=20)
    last_name: constr(min_length=5, max_length=20)


class DB_Test_Save(Base):

    __tablename__ = "test_table"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
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

class UserCreateInput(BaseModel):
    user_name: constr(min_length=3, max_length=40)
    email: EmailStr
    password: constr(min_length=8, max_length=64)


class ConfirmUser(BaseModel):
    user_name: constr(min_length=3, max_length=40)
    password: constr(min_length=8, max_length=64)


class DBUsers(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(String, index=True)


class DBAudio(Base):
    __tablename__ = "Audio"

    track_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, index=True)
    audio_name = Column(String, index=True)
    created_at = Column(String, index=True)
    file_path = Column(String, index=True)


class Return_A_Route():
    name_r = ""
    last_name_r = ""
    def __init__(self, param1, param2):
        self.last_name_r = param1
        self.name_r = param2


@router.post("/a_route")
def user(test_input: A_Route_Inputs, db : Session = Depends(get_db)):
    return_value = Return_A_Route(test_input.name + "10", test_input.last_name + "10")
    db_test = DB_Test_Save(
        name = test_input.name,
        last_name = test_input.last_name
    )
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    #return_value.name_r = test_input.name + "10"
    #return_value.last_name_r = test_input.last_name + "10"
    return db_test

@router.get("/get_test")
def get_last_name(name: str, db : Session = Depends(get_db)):
    db_find_name = db.query(DB_Test_Save).filter(DB_Test_Save.name == name).first()
    if db_find_name is None:
        return "no"
    else:
        return db_find_name.last_name


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/make_user")
def make_new_user(new_user: UserCreateInput, db : Session = Depends(get_db)):
    existing_user = db.query(DBUsers).filter(DBUsers.user_name == new_user.user_name).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    existing_email = db.query(DBUsers).filter(DBUsers.email == new_user.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already taken")


    user_save = DBUsers(
        user_name=new_user.user_name,
        email=new_user.email,
        password_hash=pwd_context.hash(new_user.password),
        created_at=time.strftime("%H:%M:%S", time.localtime())
    )

    #if not pwd_context.verify(new_user.password, user_save.password_hash):
    #    raise HTTPException(status_code=401, detail="Incorrect password")

    db.add(user_save)
    db.commit()
    db.refresh(user_save)
    return user_save


@router.get("/user/{user_id}")
def get_user_by_username(user_id: int, db: Session = Depends(get_db)):
    sample_user = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    if not sample_user:
        raise HTTPException(status_code=404, detail="User not found")
    return sample_user


@router.put("/user/update/{user_id}")
def update_user_info(user_id: int, up_user: UserCreateInput, db: Session = Depends(get_db)):
    selected_user = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_user = db.query(DBUsers).filter(DBUsers.user_name == up_user.user_name).first()
    if existing_user and existing_user.id != user_id:

        raise HTTPException(status_code=400, detail="Username already taken")

    existing_email = db.query(DBUsers).filter(DBUsers.email == up_user.email).first()
    if existing_email and existing_user.id != user_id:
        raise HTTPException(status_code=400, detail="Email already taken")

    selected_user.user_name = up_user.user_name
    selected_user.email = up_user.email
    selected_user.password = pwd_context.hash(up_user.password)

    db.commit()
    db.refresh(selected_user)

    return selected_user


@router.post("/user/confirm")
def confirm_user(attempt_user: ConfirmUser, db: Session = Depends(get_db)):
    attempted_user = db.query(DBUsers).filter(DBUsers.user_name == attempt_user.user_name).first()
    if not attempted_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not pwd_context.verify(attempt_user.password, attempted_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return attempted_user


@router.delete("/user/delete/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user_to_delete = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    name = ""
    user_to_delete_id = 101
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")

    name = user_to_delete.user_name
    user_to_delete_id = user_to_delete.id
    db.delete(user_to_delete)
    db.commit()

    # Delete corresponding audio files
    audio_records_to_delete = db.query(DBAudio).filter(DBAudio.user_id == user_to_delete_id).all()
    for audio_record in audio_records_to_delete:
        db.delete(audio_record)
        db.commit()

    test_delete = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    if not test_delete:
        return "User: " + name + ", was deleted successfully!"

    return "User: " + name + ", was deleted successfully"