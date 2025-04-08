from fastapi import FastAPI

from app.Backend.db_grabber import Base, engine
from app.Backend import api_router

# Import models to register them with Base
from app.Professor.models.user import User
from app.Professor.models.category import Category

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(api_router, prefix="")


@app.get("/")
def read_root():
    return {"Hello": "World"}
