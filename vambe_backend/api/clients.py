from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session

from vambe_backend import models, schemas
from vambe_backend.dependencies import get_db
from vambe_backend.services.client_importer import (
    import_clients_from_csv_bytes,
)

import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/clients", tags=["clients"])

IMPORT_KEY = "soyIan"

@router.get("/", response_model=List[schemas.Client])
def list_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Client).offset(skip).limit(limit).all()


@router.get("/categories/all", response_model=List[schemas.ClientFull])
def get_all_clients_with_category(db: Session = Depends(get_db)):
    return db.query(models.Client).all()


@router.get("/{client_id}", response_model=schemas.Client)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.get("/{client_id}/category", response_model=schemas.ClientCategory)
def get_client_category(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    if not client.category:
        raise HTTPException(status_code=404, detail="Category not found for client")

    return client.category


@router.post("/import_csv")
async def import_clients_from_csv(
    file: UploadFile = File(...),
    key: str = Query(..., description="Clave de seguridad"),
    db: Session = Depends(get_db),
):
    if key != IMPORT_KEY:
        raise HTTPException(status_code=403, detail="Clave inválida")

    content_bytes = await file.read()
    stats = import_clients_from_csv_bytes(content_bytes, db)
    return stats