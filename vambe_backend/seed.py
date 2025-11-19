import csv
import json
from sqlalchemy.orm import Session
from datetime import datetime
from vambe_backend.db import SessionLocal
from vambe_backend import models
import os


def seed_database():
    db: Session = SessionLocal()

    if db.query(models.Client).count() > 0:
        print("Seed skipped: data already exists.")
        return

    print("Running seed...")


    try:
        file_path = os.path.join("data", "clientes_categorizados.json")

        with open(file_path, "r", encoding="utf-8") as jf:
            data = json.load(jf)

            for entry in data:
                # ---- CLIENTE ----
                client = models.Client(
                    name=entry.get("Nombre"),
                    email=entry.get("Correo Electronico"),
                    phone=entry.get("Numero de Telefono"),
                    seller=entry.get("Vendedor asignado"),
                    meeting_date=datetime.strptime(entry.get("Fecha de la Reunion"), "%Y-%m-%d").date(),
                    closed=entry.get("closed") == "1",
                    transcript=entry.get("Transcripcion")
                )

                db.add(client)
                db.flush()

                cat = entry.get("categories", {})

                raw_volume = cat.get("volumen_consultas_semana")

                weekly_volume = None
                if raw_volume not in (None, "", "null"):
                    try:
                        weekly_volume = int(raw_volume)
                    except ValueError:
                        weekly_volume = None

                category = models.ClientCategory(
                    client_id=client.id,
                    industry=cat.get("industria"),
                    use_case=cat.get("tipo_caso_uso"),
                    main_pain=cat.get("dolor_principal"),
                    weekly_volume=weekly_volume,
                    origin_channel=cat.get("canal_origen"),
                    purchase_trigger=cat.get("trigger_compra"),
                    urgency=cat.get("urgencia"),
                    interest_level=cat.get("nivel_interes"),
                    sales_stage=cat.get("etapa_venta"),
                    monetary_opportunity=cat.get("oportunidad_monetaria"),
                    requires_integration=cat.get("requiere_integracion"),
                    complexity=cat.get("complejidad_consultas"),
                )

                db.add(category)

    except FileNotFoundError:
        print("No JSON found (data/clientes_categorizados.json)")

    db.commit()
    db.close()
    print("Seed done.")