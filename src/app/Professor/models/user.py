from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.Professor.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, unique=True, index=True)  # Matches the database field
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)  # Matches the database field
    created_at = Column(DateTime, default=datetime.now(UTC))

    # Relationship with Category (if needed)
    categories = relationship("Category", back_populates="user", lazy="select")
