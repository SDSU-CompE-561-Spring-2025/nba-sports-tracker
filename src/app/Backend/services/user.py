from sqlalchemy.orm import Session

from app.Professor.core.auth import get_password_hash
from app.Professor.core.config import get_settings
from app.Professor.core.security import verify_password
from app.Professor.models.user import User
from app.Professor.schemas.user import UserCreate

settings = get_settings()


# User CRUD operations
def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    verification_code = "1234"  # TODO: Implement verification code

    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        verification_code=verification_code,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, user_name: str, password: str):
    # Query the user_name field
    user = db.query(User).filter(User.user_name == user_name).first()
    if not user:
        return None
    # Verify the password against the password_hash field
    if not verify_password(password, user.password_hash):
        return None
    return user


def get_user_by_username(db: Session, username: str):
    user = db.query(User).filter(User.username == username).first()
    return user
