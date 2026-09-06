from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Loaded from environment variables / .env (see .env.example).
    Never hardcode secrets here — this file only defines shape and defaults.
    """
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    database_url: str = "postgresql://postgres:postgres@localhost:5432/postgres"
    frontend_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.frontend_origins.split(",") if o.strip()]


settings = Settings()
