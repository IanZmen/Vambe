import os
from dotenv import load_dotenv

load_dotenv()

def get_cors_origins():
    raw = os.getenv("CORS_ORIGINS", "")
    return [origin.strip() for origin in raw.split(",") if origin.strip()]
