from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://sim:sim@localhost:5432/schiphol_sim"
    fr24_api_key: str | None = None
    fr24_base_url: str = "https://fr24api.flightradar24.com/api"
    schiphol_app_id: str | None = None
    schiphol_app_key: str | None = None
    schiphol_base_url: str = "https://api.schiphol.nl/public-flights"
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_list(self) -> list[str]:
        return [x.strip() for x in self.cors_origins.split(",") if x.strip()]

settings = Settings()
