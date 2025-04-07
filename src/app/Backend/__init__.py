from fastapi import APIRouter

from app.Backend import test_routes

api_router = APIRouter()
api_router.include_router(test_routes.router, prefix="/auth", tags=["User"])