from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from vambe_backend import models, schemas
from vambe_backend.dependencies import get_db

import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/clients", tags=["clients"])



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


