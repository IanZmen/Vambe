# Vambe

## Descripcion general del desafio
Vambe es una aplicación que procesa transcripciones de reuniones comerciales y utiliza un modelo de lenguaje (LLM) para generar categorías automáticas de cada cliente.
A partir de estas categorías, el sistema construye un panel interactivo que permite:

- Priorizar oportunidades
- Detectar industrias atractivas
- Comparar rendimiento entre vendedores
- Identificar dolores y triggers de compra
- Analizar la calidad por canal de origen
- Visualizar métricas accionables para el equipo de ventas
- Este proyecto fue creado como solución al desafío técnico de Vambe AI.

### Flujo completo del sistema
1. El usuario sube un archivo CSV desde el frontend (según el largo puede tardear un tiempo)

        El CSV contiene:

            Nombre
            Correo
            Teléfono
            Vendedor asignado
            Fecha de la reunión
            Cierre (1/0)
            Transcripción completa

2. El backend importa el CSV con un endpoint protegido

        POST /clients/import_csv?key=soyIan

    - Procesa cada fila
    - Evita duplicados (coincidencia por nombre + email)
    - Actualiza clientes existentes
    - Crea nuevos registros según corresponda

3. Cada transcripción es enviada al LLM

    - Se usa Groq LLM (openai/gpt-oss-20b) para generar categorías
    - mediante un prompt diseñado para producir únicamente JSON válido.

4. Las categorías se guardan en la base de datos

    - Cada cliente tiene una tabla asociada ClientCategory con 12 dimensiones categóricas.

5. El frontend consume la API FastAPI

    - Obtiene clientes, categorías y métricas en tiempo real.

6. El dashboard genera visualizaciones

    - Con React + D3:
    - Tablas
    - Ratings
    - Barras comparativas
    - Filtros combinados
    - Ranking de oportunidades
    - Comparación entre vendedores por industria

## Categorias definidas
Las dimensiones fueron creadas analizando patrones presentes en las transcripciones. Cada categoria aporta un insight necesario para entender mejor a los clientes, priorizar cuentas y mejorar procesos comerciales.

1. industria: identifica verticales con mayores dolores y volumen de consultas.
2. tipo_caso_uso: describe el tipo de interaccion que el cliente necesita automatizar.
3. dolor_principal: resume el problema que motiva la busqueda de solucion.
4. volumen_consultas_semana: refleja la carga operativa actual.
5. canal_origen: muestra como el cliente conocio Vambe.
6. trigger_compra: indica que evento gatillo la necesidad.
7. urgencia: mide la criticidad del problema.
8. nivel_interes: indica la disposicion del cliente a avanzar.
9. etapa_venta: posicion del cliente dentro del embudo comercial.
10. oportunidad_monetaria: tamano relativo de la oportunidad.
11. requiere_integracion: complejidad tecnica requerida.
12. complejidad_consultas: dificultad de las interacciones a automatizar.

## Tecnologias utilizadas
- Python 3.10
- FastAPI para el backend
- Uvicorn como servidor ASGI
- GROQ LLM API para clasificar transcripciones
- React y Vite para el frontend
- D3 para la visualizacion de datos
- AWS para despliegue

## Arquitectura general
El proyecto sigue una estructura modular backend-frontend.

### El flujo que seguí es el siguiente:

Exploracion inicial de datos en un Jupyter Notebook.

Categorizacion de clientes ejecutando el script processing_with_llm.py que usa la API de GROQ para generar las categorias. Este script requiere un archivo .env con la variable de GROQ_API_KEY.

El resultado se guarda en un archivo JSON ubicado en la carpeta data.

El backend FastAPI lee ese archivo JSON y expone endpoints para que el frontend pueda consumir las categorias, clientes y metricas.

El frontend React obtiene los datos, calcula metricas adicionales y las presenta en un dashboard con tablas, filtros y visualizaciones.

Posteriormente se agrego la opción de cargar más información

### Estructura de carpetas
vambe_backend: contiene el backend con FastAPI
vambe_frontend: contiene el panel en React
data: contiene el archivo JSON generado con las categorias
notebooks: contiene el analisis exploratorio inicial
scripts: contiene el procesamiento con LLM

## Backend
El backend usa FastAPI y expone rutas para obtener clientes con categorias, metricas y detalles individuales. Se debe crear un archivo .env con un origen permitido para CORS. No se incluyen valores sensibles en el repositorio,  debe existir una variable llamada CORS_ORIGINS con el dominio del frontend y una variable llamada GROQ_API_KEY con una llave de la api de groc valida.

### Para ejecutarlo localmente:

Crear y activar un entorno virtual de Python.

Instalar dependencias con python packages.py.

Crear el archivo .env con CORS_ORIGINS= y GROQ_API_KEY=.

Ejecutar uvicorn vambe_backend.main:app --reload --app-dir ..

## Frontend
Es una aplicacion en React creada con Vite. Tiene varias vistas:

LandingPage: explicacion de la herramienta.
DashboardPage: tablas y graficos con resumenes, industrias, ranking, canales, dolores principales y complejidad vs valor.
ClientsPage: listado filtrable por industria, vendedor, urgencia, canal y dolor.
ClientDetailPage: ficha completa del cliente con categorias y datos base.

Para ejecutarlo:

Ir al directorio vambe_frontend.

Crear un archivo .env con la variable VITE_BACKEND_URL apuntando al backend.

Instalar dependencias con npm install.

Correr npm run dev.

## Métricas generadas por el dashboard
- kpis globales
- analisis por industria
- ranking de oportunidades
- performace por vendedor
- comparacion canal de origen vs calidad
- tabla de dolores principales
- tabla complejidad vs valor
- visualizacion grafica de calidad por canal

## Buenas practicas aplicadas
- modularizacion de componentes en el frontend
- separacion clara de responsabilidades backend-frontend
- carga de configuraciones mediante variables de entorno
- estructura limpia de carpetas

## Deploy

Links de la version deployada:
- backend: http://98.93.255.1:8000/docs
- frontend: http://vambe-frontend.s3-website-us-east-1.amazonaws.com/
