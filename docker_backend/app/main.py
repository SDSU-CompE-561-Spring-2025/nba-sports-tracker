import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import logging

from app.Backend.database import Base, engine
from app.Backend import api_router

UPLOAD_DIR = "uploaded_audio"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Configure logging - used chat gpt to help with this
logging.basicConfig(level=logging.WARNING)

# Create the FastAPI app
app = FastAPI()

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Log the incoming request
        logging.info(f"Incoming request: {request.method} {request.url}")
        response = await call_next(request)
        # Log the outgoing response
        logging.info(f"Response status: {response.status_code}")
        return response
    
class StripTrailingSlashMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        url_path = request.url.path
        if url_path != "/" and url_path.endswith("/"):
            new_url = request.url.replace(path=url_path.rstrip("/"))
            return RedirectResponse(url=str(new_url), status_code=307)
        response = await call_next(request)
        return response

# Initialize the database
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.add_middleware(StripTrailingSlashMiddleware)

# Add CORS middleware - used chat gpt to help with this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://theaudiohub.fly.dev"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Add logging middleware
app.add_middleware(LoggingMiddleware)

# Include the API router
app.include_router(api_router, prefix="")

@app.get("/")
def read_root():
    return {"Hello": "World"}

