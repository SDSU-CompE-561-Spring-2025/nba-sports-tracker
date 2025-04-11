from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, constr, EmailStr, Field, FilePath
from app.Backend.db_grabber import Base, get_db
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Session
import time
from datetime import datetime, timedelta, UTC
import jwt
from passlib.context import CryptContext
from datetime import timezone
from app.schemas.token import Token
router = APIRouter()
from app.core.config import settings

#verification code libraries
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail



SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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


class UpdateUserName(BaseModel):
    user_name: constr(min_length=3, max_length=40)

class UpdateEmail(BaseModel):
    email: EmailStr

class UpdatePassword(BaseModel):
    password: constr(min_length=8, max_length=64)

class ConfirmUser(BaseModel):
    user_name: constr(min_length=3, max_length=40)
    password: constr(min_length=8, max_length=64)


class AudioCreateInput(BaseModel):
    audio_name: constr(min_length=3, max_length=40)
    file_path: str


class DBUsers(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(String, index=True)

    is_verified = Column(Boolean, default=True)
    verification_code = Column(String, nullable=True)
    verification_code_expiry = Column(String, nullable=True)  # Expiration time for verification code


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

    # Generate verification code
    verification_code = generate_verification_code()

    user_save = DBUsers(
        user_name=new_user.user_name,
        email=new_user.email,
        password_hash=pwd_context.hash(new_user.password),
        created_at=time.strftime("%H:%M:%S", time.localtime()),
        is_verified=False,
        verification_code=verification_code,
        verification_code_expiry=datetime.now(timezone.utc) + timedelta(minutes=10)  # Set expiration time to 10 minutes from now
    )

    send_verification_email(new_user.email, verification_code)

    #if not pwd_context.verify(new_user.password, user_save.password_hash):
    #    raise HTTPException(status_code=401, detail="Incorrect password")

    db.add(user_save)
    db.commit()
    db.refresh(user_save)
    return user_save

@router.put("/user/verify/{user_id}")
def verify_user(user_id: int, verification_code: str, db: Session = Depends(get_db)):
    selected_user = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if (selected_user.verification_code == str(verification_code)):
        # Check if the verification code is expired
        TimeExpiryVerification = str(datetime.now(timezone.utc))
        if (TimeExpiryVerification < selected_user.verification_code_expiry):
            # Verification code is valid and not expired
            selected_user.is_verified = True
            db.commit()
            db.refresh(selected_user)
            return selected_user
        else: 
            raise HTTPException(status_code=400, detail="Verification code expired, please request a new one")
    else:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    

@router.put("/user/verify/newcoderequest/{user_id}")
def request_new_verification_code(user_id: int, db: Session = Depends(get_db)):
    selected_user = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if selected_user.is_verified:
        raise HTTPException(status_code=400, detail="User already verified")
    # Generate verification code
    verification_code = generate_verification_code()
    
    selected_user.verification_code=verification_code
    selected_user.verification_code_expiry=datetime.now(timezone.utc) + timedelta(minutes=10)  # Set expiration time to 10 minutes from now

    send_verification_email(selected_user.email, verification_code)

    db.commit()
    db.refresh(selected_user)
    
    return HTTPException(status_code=200, detail="New verification code sent to email")



@router.get("/user/{user_id}")
def get_user_by_username(user_id: int, db: Session = Depends(get_db)):
    sample_user = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    if not sample_user:
        raise HTTPException(status_code=404, detail="User not found")
    return sample_user

@router.get("/audio/temp_view/{user_id}")
def get_user_by_username(user_id: int, db: Session = Depends(get_db)):
    sample_user = db.query(DBAudio).filter(DBAudio.user_id == user_id).first()
    if not sample_user:
        raise HTTPException(status_code=404, detail="No Audio")
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


@router.put("/user/update/username/{user_id}")
def update_username(user_id: int, up_user: UpdateUserName, db: Session = Depends(get_db)):
    selected_user = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_user = db.query(DBUsers).filter(DBUsers.user_name == up_user.user_name).first()
    if existing_user and existing_user.id != user_id:

        raise HTTPException(status_code=400, detail="Username already taken")

    selected_user.user_name = up_user.user_name

    db.commit()
    db.refresh(selected_user)

    return selected_user.user_name

@router.put("/user/update/password/{user_id}")
def update_password(user_id: int, up_user: UpdatePassword, db: Session = Depends(get_db)):
    selected_user = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")

    selected_user.password = pwd_context.hash(up_user.password)

    db.commit()
    db.refresh(selected_user)

    return "Password updated for " + selected_user.user_name

@router.put("/user/update/email/{user_id}")
def update_email(user_id: int, up_user: UpdateEmail, db: Session = Depends(get_db)):
    selected_user = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_email = db.query(DBUsers).filter(DBUsers.email == up_user.email).first()
    if existing_email and existing_email.id != user_id:
        raise HTTPException(status_code=400, detail="Email already taken")

    selected_user.email = up_user.email
   
    db.commit()
    db.refresh(selected_user)

    return "Email updated for " + selected_user.user_name

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

    return "User: " + name + ", was not deleted"


@router.post("/audio/create/{user_id}")
def user_create_audio(user_id: int, audio_input: AudioCreateInput, db: Session = Depends(get_db)):
    attempted_user = db.query(DBUsers).filter(DBUsers.id == user_id).first()
    if not attempted_user:
        raise HTTPException(status_code=404, detail="User not found")

    user_audios = db.query(DBAudio).filter(DBAudio.user_id == user_id).all()

    for audio_file in user_audios:
        if audio_file.audio_name == audio_input.audio_name:
            raise HTTPException(status_code=400, detail="Audio name already used")

    audio_save = DBAudio(
        user_id=user_id,
        audio_name=audio_input.audio_name,
        created_at=time.strftime("%H:%M:%S", time.localtime()),
        file_path=audio_input.file_path
    )

    db.add(audio_save)
    db.commit()
    db.refresh(audio_save)
    return audio_save

@router.get("/audio/get_audios/{user_id}")
def user_get_all_audio(user_id: int, db: Session = Depends(get_db)):
    audio_records = db.query(DBAudio).filter(DBAudio.user_id == user_id).all()
    return audio_records


@router.put("/audio/update/{audio_id}")
def update_audio(audio_id: int, audio_input: AudioCreateInput, db: Session = Depends(get_db)):
    selected_audio = db.query(DBAudio).filter(DBAudio.track_id == audio_id).first()
    if not selected_audio:
        raise HTTPException(status_code=404, detail="Audio not found")

    all_user_audios = db.query(DBAudio).filter(DBAudio.user_id == selected_audio.user_id).all()

    for user_audio in all_user_audios:
        if user_audio.track_id != selected_audio.track_id:
            if user_audio.audio_name == audio_input.audio_name:
                raise HTTPException(status_code=400, detail="Audio name already used")

    selected_audio.audio_name = audio_input.audio_name
    selected_audio.file_path = audio_input.file_path

    db.commit()
    db.refresh(selected_audio)
    return selected_audio

@router.delete("/audio/delete/{audio_id}")
def delete_audio(audio_id: int, db: Session = Depends(get_db)):
    audio_to_delete = db.query(DBAudio).filter(DBAudio.track_id == audio_id).first()
    if not audio_to_delete:
        raise HTTPException(status_code=404, detail="Audio not found with provided id")
    name = audio_to_delete.audio_name
    db.delete(audio_to_delete)
    db.commit()

    test_delete = db.query(DBAudio).filter(DBAudio.track_id == audio_id).first()
    if not test_delete:
        return "Audio file: " + name + ", was deleted successfully!"

    return "Audio file: " +  name + ", was not deleted"

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(UTC) + (
        expires_delta if expires_delta else timedelta(minutes=15)
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Authenticate user
    user = db.query(DBUsers).filter(DBUsers.user_name == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_name}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


def generate_verification_code():
    import random
    
    code = random.randint(100000, 999999) #6 digit code random

    return code

def send_verification_email(to_email, code):
    message = Mail(
        from_email='loraha4821@sdsu.edu',
        to_emails=to_email,
        subject='Your Verification Code',
        plain_text_content=f'Your code is: {code}'
    )

    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)  # api key to send the email
        response = sg.send(message)
        return response.status_code
    except Exception as e:
        print(str(e))
        return None

