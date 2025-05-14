from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    SENDGRID_API_KEY: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

print("database_url", settings.DATABASE_URL)