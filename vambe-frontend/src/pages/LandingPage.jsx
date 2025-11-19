import { Link } from "react-router-dom";
import "./LandingPage.css";
import "../styles/page-base.css";


export default function LandingPage() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Vambe · Client Intelligence</h1>

      <p className="landing-description">
        Este panel usa categorías generadas por LLM para convertir transcripciones en 
        <strong> insights accionables </strong> para el equipo comercial.
      </p>

      <ul className="landing-list">
        <li>Priorizar oportunidades según urgencia, interés y valor.</li>
        <li>Detectar las industrias más atractivas.</li>
        <li>Analizar la calidad por canal de origen.</li>
      </ul>

      <Link to="/dashboard" className="landing-button">
        Ir al dashboard →
      </Link>
    </div>
  );
}
