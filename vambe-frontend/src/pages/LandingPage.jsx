import { Link } from "react-router-dom";
import "./LandingPage.css";
import "../styles/page-base.css";

const panels = [
  {
    title: "Comparar vendedores por industria",
    description:
      "Visualiza de inmediato qué vendedor domina cada industria y su tasa de cierre para reforzar la estrategia.",
    tag: "Industria",
  },
  {
    title: "Prioriza oportunidades críticas",
    description:
      "Clasificamos automáticamente cada transcripción por urgencia, interés y tamaño esperado de la cuenta.",
    tag: "Prioridad",
  },
  {
    title: "Calidad por canal",
    description:
      "Evalúa el performance de tus canales de origen y enfoca inversión en los que mejor convierten.",
    tag: "Origen",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-layout">
      <section className="landing-hero page-container">
        <div className="landing-hero-copy">
          <span className="landing-chip">Panel inteligente para ventas</span>
          <h1 className="landing-title">Vambe · Client Intelligence</h1>
          <p className="landing-description">
            Usa IA para transformar tus conversaciones en un dashboard moderno que resalta oportunidades,
            riesgos y próximos pasos. Todo listo para que el equipo comercial actúe en minutos.
          </p>

          <div className="landing-button-group">
            <Link to="/dashboard" className="landing-button">
              Ir al dashboard →
            </Link>
            <Link to="/upload" className="landing-button secondary">
              Subir CSV →
            </Link>
          </div>

          <ul className="landing-list">
            <li>Prioriza oportunidades según urgencia e interés.</li>
            <li>Detecta las industrias más atractivas y rentables.</li>
            <li>Analiza la calidad por canal de origen.</li>
          </ul>
        </div>

        <div className="landing-hero-panel">
          <h3>Lo primero que verás</h3>
          <p className="landing-panel-text">
            KPIs de urgencia e interés seguidos del comparador vendedores vs industria.
          </p>
          <div className="landing-metric-board">
            <div>
              <span>Rendimiento</span>
              <strong>Estadisticas de vendedores</strong>
            </div>
            <div>
              <span>Top industrias</span>
              <strong>Deducelo con bases</strong>
            </div>
            <div>
              <span>Comparativa</span>
              <strong>Vendedores x Industria</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-panels">
        {panels.map((panel) => (
          <article key={panel.title} className="landing-panel">
            <span className="landing-panel-tag">{panel.tag}</span>
            <h3>{panel.title}</h3>
            <p>{panel.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
