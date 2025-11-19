// src/pages/UploadCsvPage.jsx
import { useState } from "react";
import "../styles/page-base.css";
import "./UploadCsvPage.css";

const checklist = [
  "Archivo CSV con cabecera idéntica al ejemplo de clientes.",
  "Texto en UTF-8 y sin fórmulas para evitar caracteres extraños.",
  "Máximo 1.000 filas por carga para mantener el performance.",
];

export default function UploadCsvPage() {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (!file) {
      setError("Debes seleccionar un archivo CSV.");
      setLoading(false);
      return;
    }

    if (!key) {
      setError("Debes ingresar la clave de acceso.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/clients/import_csv?key=${key}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Error al subir el archivo.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Algo salió mal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container upload-page">
      <div className="upload-header">
        <span className="upload-chip">Operaciones</span>
        <h1 className="section-title">Importar CSV de Clientes</h1>
        <p className="section-description">
          Envía un CSV con tus clientes y transcripciones para clasificarlos con LLM. El pipeline detecta urgencia,
          interés, industria y complejidad automáticamente. Ten a mano la clave de administración para autorizar el proceso.
        </p>
      </div>

      <div className="upload-grid">
        <form className="upload-form" onSubmit={handleUpload}>
          <label className="upload-label">
            Archivo CSV
            <div className="upload-dropzone">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="upload-file-input"
              />
              <div className="upload-dropzone-text">
                <strong>{file ? file.name : "Arrastra o selecciona un CSV"}</strong>
                <span>Formato .csv · Máx 10MB · UTF-8</span>
              </div>
            </div>
          </label>

          <label className="upload-label">
            Clave de acceso
            <input
              type="password"
              className="upload-text-input"
              placeholder="Ingresa la clave (soyIan)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </label>

          <div className="upload-actions">
            <button className="upload-button" disabled={loading}>
              {loading ? "Procesando..." : "Subir CSV"}
            </button>
            <p className="upload-hint">
              Validamos columnas como seller, industry y transcript. El proceso puede tardar ~2 min.
            </p>
          </div>
        </form>

        <aside className="upload-sidecard">
          <h3>Checklist rápida</h3>
          <ul>
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            ¿Dudas? Envía el archivo de ejemplo al equipo de datos y revisamos la estructura contigo antes de importarlo.
          </p>
        </aside>
      </div>

      {error && (
        <div className="upload-feedback error" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className="upload-result">
          <h3>Último resultado</h3>
          <div className="upload-result-grid">
            <div>
              <span>Filas procesadas</span>
              <strong>{result.processed_rows}</strong>
            </div>
            <div>
              <span>Clientes creados</span>
              <strong>{result.created_clients}</strong>
            </div>
            <div>
              <span>Clientes actualizados</span>
              <strong>{result.updated_clients}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
