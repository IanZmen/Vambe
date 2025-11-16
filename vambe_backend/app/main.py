from fastapi import FastAPI

app = FastAPI(title="Vambe Client Categorization API")

@app.get("/health")
def health():
    return {"status": "ok"}
