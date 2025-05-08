#External Imports
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import time
from datetime import datetime, timedelta, UTC
from passlib.context import CryptContext
from datetime import timezone

#Imports from other files
from app.Backend.models import DBUsers, DBAudio
from app.Backend.schemas import UserCreateInput, UpdateUserName, UpdateEmail, UpdatePassword, ConfirmUser, AudioCreateInput
from app.Backend.auth import create_access_token, decode_access_token, generate_verification_code, send_verification_email
from app.core.config import settings
from app.schemas.token import Token
from app.Backend.database import Base, get_db


#Secret Key Settings
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
#Actual Routes
#got 200
@router.post("/make_user")
async def make_new_user(new_user: UserCreateInput, db : AsyncSession = Depends(get_db)):
    stmt = select(DBUsers).where(DBUsers.user_name == new_user.user_name)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    stmt = select(DBUsers).where(DBUsers.email == new_user.email)
    result = await db.execute(stmt)
    existing_email = result.scalar_one_or_none()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already taken")

    # Generate verification code
    verification_code = generate_verification_code()

    user_save = DBUsers(
        user_name=new_user.user_name,
        email=new_user.email,
        password_hash=pwd_context.hash(new_user.password),
        is_verified=False,
        verification_code= str(verification_code),
        verification_code_expiry=datetime.now(timezone.utc) + timedelta(minutes=10)  # Set expiration time to 10 minutes from now
    )

    send_verification_email(new_user.email, verification_code)

    #if not pwd_context.verify(new_user.password, user_save.password_hash):
    #    raise HTTPException(status_code=401, detail="Incorrect password")

    db.add(user_save)
    await db.commit()
    await db.refresh(user_save)
    return user_save

#need to debug
@router.put("/user/verify")
async def verify_user(verification_code: str, token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username  # Assuming the username is stored as the user ID in the token
    
    stmt = select(DBUsers).where(DBUsers.user_name == user_id)
    result = await db.execute(stmt)
    selected_user = result.scalar_one_or_none()

    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if (selected_user.verification_code == str(verification_code)):
        # Check if the verification code is expired
        TimeExpiryVerification = str(datetime.now(timezone.utc))
        if (TimeExpiryVerification < selected_user.verification_code_expiry):
            # Verification code is valid and not expired
            selected_user.is_verified = True
            await db.commit()
            await db.refresh(selected_user)
            return selected_user
        else: 
            raise HTTPException(status_code=400, detail="Verification code expired, please request a new one")
    else:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
#got 200
@router.put("/user/verify/newcoderequest")
async def request_new_verification_code(token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username

    stmt = select(DBUsers).where(DBUsers.user_name == user_id)
    result = await db.execute(stmt)
    selected_user = result.scalar_one_or_none()

    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if selected_user.is_verified:
        raise HTTPException(status_code=400, detail="User already verified")
    # Generate verification code
    verification_code = generate_verification_code()
    
    selected_user.verification_code=str(verification_code)
    selected_user.verification_code_expiry=datetime.now(timezone.utc) + timedelta(minutes=10)  # Set expiration time to 10 minutes from now

    send_verification_email(selected_user.email, verification_code)

    await db.commit()
    await db.refresh(selected_user)
    
    return HTTPException(status_code=200, detail="New verification code sent to email")

#got 200
@router.get("/user")
async def get_user_by_username(token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username

    stmt = select(DBUsers).where(DBUsers.user_name == user_id)
    result = await db.execute(stmt)
    sample_user = result.scalar_one_or_none()

    if not sample_user:
        raise HTTPException(status_code=404, detail="User not found")
    return sample_user

#got 200
@router.put("/user/update")
async def update_user_info(up_user: UserCreateInput, token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username
   
    #target user
    stmt = select(DBUsers).where(DBUsers.user_name == user_id)
    result = await db.execute(stmt)
    selected_user = result.scalar_one_or_none()

    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    #check for username conflict
    stmt = select(DBUsers).where(DBUsers.user_name == up_user.user_name)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if existing_user and existing_user.id != user_id:

        raise HTTPException(status_code=400, detail="Username already taken")

    # Check for email conflict
    stmt = select(DBUsers).where(DBUsers.email == up_user.email)
    result = await db.execute(stmt)
    existing_email = result.scalar_one_or_none()

    if existing_email and existing_user.id != user_id:
        raise HTTPException(status_code=400, detail="Email already taken")

    selected_user.user_name = up_user.user_name
    selected_user.email = up_user.email
    selected_user.password = pwd_context.hash(up_user.password)

    await db.commit()
    await db.refresh(selected_user)

    return selected_user

#debug
@router.delete("/user/delete")
async def delete_user(token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username

    stmt = select(DBUsers).where(DBUsers.user_name == user_id)
    result = await db.execute(stmt)
    user_to_delete = result.scalar_one_or_none()

    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")

    name = user_to_delete.user_name

    #delete user
    await db.delete(user_to_delete)
    await db.commit()

    # Delete corresponding audio files
    stmt = select(DBAudio).where(DBAudio.user_id == user_id)
    result = await db.execute(stmt)
    audio_records_to_delete = result.scalars().all()

    for audio_record in audio_records_to_delete:
        await db.delete(audio_record)
        await db.commit()

    # Verify deletion
    stmt = select(DBUsers).where(DBUsers.id == user_id)
    result = await db.execute(stmt)
    test_delete = result.scalar_one_or_none()
    if not test_delete:
        return "User: " + name + ", was deleted successfully!"

    return "User: " + name + ", was not deleted"


#debug
@router.get("/audio/temp_view")
async def get_user_by_username(token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username

    stmt = select(DBAudio).where(DBAudio.user_name == user_id)
    result = await db.execute(stmt)
    sample_user = result.scalar_one_or_none()

    if not sample_user:
        raise HTTPException(status_code=404, detail="No Audio")
    return sample_user

#got 200
@router.put("/user/update/username")
async def update_username(up_user: UpdateUserName, token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username
    
    # Get user by ID
    stmt = select(DBUsers).where(DBUsers.user_name == user_id)
    result = await db.execute(stmt)
    selected_user = result.scalar_one_or_none()

    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if new username is already taken
    stmt = select(DBUsers).where(DBUsers.user_name == up_user.user_name)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if existing_user and existing_user.id != user_id:

        raise HTTPException(status_code=400, detail="Username already taken")

    selected_user.user_name = up_user.user_name

    await db.commit()
    await db.refresh(selected_user)

    return selected_user.user_name

#got 200
@router.put("/user/update/password")
async def update_password(up_user: UpdatePassword, token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username
    
    stmt = select(DBUsers).where(DBUsers.user_name == user_id)
    result = await db.execute(stmt)
    selected_user = result.scalar_one_or_none()

    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")

    selected_user.password = pwd_context.hash(up_user.password)

    await db.commit()
    await db.refresh(selected_user)

    return "Password updated for " + selected_user.user_name

#got 200
@router.put("/user/update/email")
async def update_email(up_user: UpdateEmail, token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username

    stmt = select(DBUsers).where(DBUsers.user_name == user_id)
    result = await db.execute(stmt)
    selected_user = result.scalar_one_or_none()

    if not selected_user:
        raise HTTPException(status_code=404, detail="User not found")

    stmt = select(DBUsers).where(DBUsers.email == up_user.email)
    result = await db.execute(stmt)
    existing_email = result.scalar_one_or_none()

    if existing_email and existing_email.id != user_id:
        raise HTTPException(status_code=400, detail="Email already taken")

    selected_user.email = up_user.email
   
    await db.commit()
    await db.refresh(selected_user)

    return "Email updated for " + selected_user.user_name

#got 200
@router.post("/user/confirm")
async def confirm_user(attempt_user: ConfirmUser, db: AsyncSession = Depends(get_db)):
    stmt = select(DBUsers).where(DBUsers.user_name == attempt_user.user_name)
    result = await db.execute(stmt)
    attempted_user = result.scalar_one_or_none()

    if not attempted_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not pwd_context.verify(attempt_user.password, attempted_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return attempted_user

#debug
@router.post("/audio/create")
async def user_create_audio(audio_input: AudioCreateInput, token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username
    
    # Check if user exists
    stmt = select(DBUsers).where(DBUsers.user_name == user_id)
    result = await db.execute(stmt)
    attempted_user = result.scalar_one_or_none()

    if not attempted_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check for duplicate audio name
    stmt = select(DBAudio).where(DBAudio.user_id == attempted_user.id)
    result = await db.execute(stmt)
    user_audios = result.scalars().all()

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
    await db.commit()
    await db.refresh(audio_save)

    return audio_save

#debug
@router.get("/audio/get_audios")
async def user_get_all_audio(token: str = Header(...), db: AsyncSession = Depends(get_db)):
    token_data = decode_access_token(token)
    user_id = token_data.username

    stmt = select(DBAudio).where(DBAudio.user_id == user_id)
    result = await db.execute(stmt)
    audio_records = result.scalars().all()

    return audio_records


@router.put("/audio/update/{audio_id}")
async def update_audio(audio_id: int, audio_input: AudioCreateInput, db: AsyncSession = Depends(get_db)):
    # Check if audio exists
    stmt = select(DBAudio).where(DBAudio.track_id == audio_id)
    result = await db.execute(stmt)
    selected_audio = result.scalar_one_or_none()

    if not selected_audio:
        raise HTTPException(status_code=404, detail="Audio not found")

    stmt = select(DBAudio).where(DBAudio.user_id == selected_audio.user_id)
    result = await db.execute(stmt)
    all_user_audios = result.scalars().all()

    for user_audio in all_user_audios:
        if user_audio.track_id != selected_audio.track_id:
            if user_audio.audio_name == audio_input.audio_name:
                raise HTTPException(status_code=400, detail="Audio name already used")

    selected_audio.audio_name = audio_input.audio_name
    selected_audio.file_path = audio_input.file_path

    await db.commit()
    await db.refresh(selected_audio)

    return selected_audio

@router.delete("/audio/delete/{audio_id}")
async def delete_audio(audio_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(DBAudio).where(DBAudio.track_id == audio_id)
    result = await db.execute(stmt)
    audio_to_delete = result.scalar_one_or_none()
    
    if not audio_to_delete:
        raise HTTPException(status_code=404, detail="Audio not found with provided id")
    name = audio_to_delete.audio_name

    await db.delete(audio_to_delete)
    await db.commit()

    stmt = select(DBAudio).where(DBAudio.track_id == audio_id)
    result = await db.execute(stmt)
    test_delete = result.scalar_one_or_none()

    if not test_delete:
        return "Audio file: " + name + ", was deleted successfully!"

    return "Audio file: " +  name + ", was not deleted"

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    # Authenticate user
    stmt = select(DBUsers).where(DBUsers.user_name == form_data.username)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

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







