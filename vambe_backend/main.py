from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from vambe_backend.db import Base, engine
from vambe_backend.api import health, clients, categories
from vambe_backend.seed import seed_database

import logging

logger = logging.getLogger(__name__)

app = FastAPI(title="Vambe Client Categorization API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_database()


app.include_router(health.router)
app.include_router(clients.router)
app.include_router(categories.router)


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request, exc: SQLAlchemyError):
    logger.error(f"DB error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Database error"},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request, exc: Exception):
    logger.error(f"Unexpected error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )