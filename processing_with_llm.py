import csv
import json
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

PROMPT_TEMPLATE = """
Analiza la siguiente transcripción de una reunión con un potencial cliente de Vambe y clasifícala en las categorías indicadas.
Responde SOLO un JSON válido, sin texto adicional.

Campos (usa exactamente estos nombres de clave):

- industria: rubro de la empresa (ej: "Servicios financieros", "E-commerce", "Salud", "Educación"). Si no se infiere: "Desconocido".

- tipo_caso_uso: elegir uno:
  "Soporte técnico", "Atención al cliente general", "Ventas / pre-venta",
  "Reservas / agendamiento", "Logística / envíos",
  "Consultas administrativas", "Otro".

- dolor_principal: **UNA etiqueta corta** (1 a 3 palabras como máximo) que resuma el problema central.
  Ejemplos de formato:
  "alto volumen", "consultas repetitivas", "gestión manual", 
  "ineficiencia operativa", "picos estacionales", "falta de automatización".
  NO usar frases largas.

- volumen_consultas_semana: entero aproximado de interacciones por semana.
  Si es por día: multiplicar por 7. Si es por mes: dividir por 4. Si no se sabe: null.

- canal_origen: cómo conoció al producto. Elegir o describir brevemente, por ejemplo:
  "Recomendación", "Conferencia / evento", "Búsqueda en Google",
  "Artículo / blog", "Podcast", "Redes sociales", "Otro", "No especificado".

- trigger_compra: motivo principal que gatilla la búsqueda de solución
  (ej: crecimiento de volumen, expansión, temporada alta, apertura de sucursal, etc.).

- urgencia: "Alta", "Media" o "Baja".

- nivel_interes: "Alto", "Medio" o "Bajo".

- etapa_venta: "Descubrimiento", "Evaluación", "Decisión" o "Post-venta".

- oportunidad_monetaria: "Pequeña", "Mediana", "Grande" o "Desconocido".
  Debe ser inferida según tamaño percibido de la oportunidad (volumen de consultas, tamaño de empresa, complejidad, etc.), no en dinero.

- requiere_integracion: "Sí" o "No" según si menciona integrar con otros sistemas (ecommerce, CRM, agenda, tickets, etc.).

- complejidad_consultas: "Baja", "Media" o "Alta" según la dificultad típica de las preguntas (simples, mixtas o muy técnicas/legales/salud).

Responde EXCLUSIVAMENTE un JSON válido. 
No incluyas explicaciones, notas ni texto fuera del JSON.

TRANSCRIPCIÓN:
\"\"\"{transcript}\"\"\"
"""

def classify(transcript: str):
    prompt = PROMPT_TEMPLATE.format(transcript=transcript)
    resp = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role":"user","content":prompt}],
        temperature=0.1
    )
    content = resp.choices[0].message.content
    try:
        return json.loads(content)
    except:
        print("\n❌ ERROR PARSEANDO JSON. Respuesta cruda del modelo:\n", content)
        raise

results = []

with open("vambe_clients.csv", newline="") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        categories = classify(row["Transcripcion"])
        row["categories"] = categories
        results.append(row)

with open("clientes_categorizados.json", "w") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("✔️ Listo. Archivo generado: clientes_categorizados.json")