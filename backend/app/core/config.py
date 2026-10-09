import os
from typing import Optional

class Settings:
    PROJECT_NAME: str = "WhyBadAQI API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("JWT_SECRET", "whybadaqi_hackathon_super_secret_jwt_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "whybadaqi")
    USE_SQLITE_FALLBACK: bool = True
    SQLITE_PATH: str = os.getenv("SQLITE_PATH", "whybadaqi.db")
    
    # External Data Keys (Hybrid mode: fallback simulated if None)
    OPENAQ_API_KEY: Optional[str] = os.getenv("OPENAQ_API_KEY", None)
    OPENWEATHER_API_KEY: Optional[str] = os.getenv("OPENWEATHER_API_KEY", None)
    FIRMS_MAP_KEY: Optional[str] = os.getenv("FIRMS_MAP_KEY", None)

settings = Settings()
