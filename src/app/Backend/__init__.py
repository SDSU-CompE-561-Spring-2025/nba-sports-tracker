from fastapi import APIRouter

from app.Backend import routes

api_router = APIRouter()
api_router.include_router(routes.router, prefix="/auth", tags=["User"])