from __future__ import annotations

import csv
import io
from datetime import datetime
from typing import Dict, Any

from sqlalchemy.orm import Session

from vambe_backend import models
from vambe_backend.llm_classifier import classify_transcript


def _decode_bytes(content_bytes: bytes) -> str:
    try:
        return content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        return content_bytes.decode("latin-1")


def parse_csv_content(content_bytes: bytes):
    """
    Devuelve un generador de filas (dict) a partir del CSV subido.
    """
    content_str = _decode_bytes(content_bytes)
    return csv.DictReader(io.StringIO(content_str))


def normalize_row(row: Dict[str, str]) -> Dict[str, Any]:
    """
    Normaliza una fila del CSV al formato que espera nuestro modelo.
    """
    name = row.get("Nombre", "").strip()
    email = row.get("Correo Electronico", "").strip()
    phone = row.get("Numero de Telefono", "").strip()
    meeting_date_raw = row.get("Fecha de la Reunion", "").strip()
    seller = row.get("Vendedor asignado", "").strip()
    closed_raw = row.get("closed", "").strip()
    transcript = row.get("Transcripcion", "").strip()

    if not name or not email:
        return {}

    meeting_date = datetime.fromisoformat(meeting_date_raw).date()
    closed = closed_raw in ("1", "true", "True", "TRUE")

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "seller": seller,
        "meeting_date": meeting_date,
        "closed": closed,
        "transcript": transcript,
    }


def get_or_upsert_client(db: Session, data: Dict[str, Any]) -> models.Client:
    client_obj = (
        db.query(models.Client)
        .filter(
            models.Client.name == data["name"],
            models.Client.email == data["email"],
        )
        .first()
    )

    if client_obj:
        client_obj.phone = data["phone"]
        client_obj.seller = data["seller"]
        client_obj.meeting_date = data["meeting_date"]
        client_obj.closed = data["closed"]
        client_obj.transcript = data["transcript"]
        return client_obj

    client_obj = models.Client(**data)
    db.add(client_obj)
    db.flush()  
    return client_obj


def map_llm_to_category(raw: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "industry": raw.get("industria", "Desconocido"),
        "use_case": raw.get("tipo_caso_uso", "Otro"),
        "main_pain": raw.get("dolor_principal", "Desconocido"),
        "weekly_volume": raw.get("volumen_consultas_semana"),
        "origin_channel": raw.get("canal_origen", "No especificado"),
        "purchase_trigger": raw.get("trigger_compra", "No especificado"),
        "urgency": raw.get("urgencia", "Media"),
        "interest_level": raw.get("nivel_interes", "Medio"),
        "sales_stage": raw.get("etapa_venta", "Descubrimiento"),
        "monetary_opportunity": raw.get("oportunidad_monetaria", "Desconocido"),
        "requires_integration": raw.get("requiere_integracion", "No"),
        "complexity": raw.get("complejidad_consultas", "Media"),
    }


def upsert_category_for_client(
    db: Session, client_obj: models.Client, category_data: Dict[str, Any]
):
    if client_obj.category:
        for field, value in category_data.items():
            setattr(client_obj.category, field, value)
    else:
        cat = models.ClientCategory(
            client_id=client_obj.id,
            **category_data,
        )
        db.add(cat)


def import_clients_from_csv_bytes(content_bytes: bytes, db: Session) -> Dict[str, int]:
    reader = parse_csv_content(content_bytes)

    processed = 0
    created = 0
    updated = 0

    for row in reader:
        processed += 1
        data = normalize_row(row)
        if not data:
            continue

        existing = (
            db.query(models.Client)
            .filter(
                models.Client.name == data["name"],
                models.Client.email == data["email"],
            )
            .first()
        )

        if existing:
            client_obj = get_or_upsert_client(db, data)
            updated += 1
        else:
            client_obj = get_or_upsert_client(db, data)
            created += 1

        categories_raw = classify_transcript(data["transcript"])
        category_data = map_llm_to_category(categories_raw)

        upsert_category_for_client(db, client_obj, category_data)

    db.commit()

    return {
        "processed_rows": processed,
        "created_clients": created,
        "updated_clients": updated,
    }
