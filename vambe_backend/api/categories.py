from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from vambe_backend.dependencies import get_db
from vambe_backend import models, schemas

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=List[schemas.ClientCategory])
def list_all_categories(db: Session = Depends(get_db)):
    return db.query(models.ClientCategory).all()


@router.get("/{category_id}", response_model=schemas.ClientCategory)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.ClientCategory).filter(models.ClientCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get("/client/{client_id}", response_model=schemas.ClientCategory)
def get_category_by_client(client_id: int, db: Session = Depends(get_db)):
    category = db.query(models.ClientCategory).filter(models.ClientCategory.client_id == client_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found for this client")
    return category
