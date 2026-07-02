from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Supabase
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""

    # Gemini
    gemini_api_key: str = ""
    gemini_vision_model: str = "gemini-2.5-flash"
    gemini_text_model: str = "gemini-2.5-flash"

    # Google OAuth
    google_client_id: str = ""
    google_client_secret: str = ""

    # App
    app_secret_key: str = "dev-secret-change-me"
    environment: str = "development"
    frontend_url: str = "http://localhost:5173"
    allowed_origins: str = "http://localhost:5173"

    # Rate limiting
    rate_limit_per_minute: int = 30

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
