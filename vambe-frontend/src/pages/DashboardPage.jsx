import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClientsWithCategories } from "../services/api";
import { useDashboardData } from "../hooks/useDashboardData";
import KpiCard from "../components/KpiCard";

import "../styles/page-base.css";
import "../styles/table.css";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await getClientsWithCategories();
      setClients(data);
      setLoading(false);
    }
    load();
  }, []);

  const { kpis, industriesSummary, originSummary, priorityList, sellerStats } =
    useDashboardData(clients);

  if (loading) return <p>Cargando panel...</p>;

  return (
    <div className="page-container">
      <section className="section">
        <h2 className="section-title">Resumen general</h2>
        <div className="kpi-grid">
          <KpiCard label="Oportunidades totales" value={kpis.totalOportunidades} />
          <KpiCard label="Con categorías" value={kpis.oportunidadesConCategoria} />
          <KpiCard label="Alta urgencia" value={kpis.altaUrgencia} />
          <KpiCard label="Alto interés" value={kpis.altoInteres} />
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Industria vs calidad de oportunidad</h2>
        <p className="section-description">
          Haz clic en una fila para ver los clientes de esa industria.
        </p>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Industria</th>
                <th>N° oportunidades</th>
                <th>% alta urgencia</th>
                <th>% alto interés</th>
                <th>% oportunidad grande</th>
                <th>% requiere integración</th>
                <th>Consultas/semana promedio</th>
              </tr>
            </thead>
            <tbody>
              {industriesSummary.map((row) => (
                <tr
                  key={row.industry}
                  className="clickable-row"
                  onClick={() =>
                    navigate(`/clientes?industria=${encodeURIComponent(row.industry)}`)
                  }
                >
                  <td>{row.industry}</td>
                  <td>{row.cantidad}</td>
                  <td>{row.pctAltaUrgencia}%</td>
                  <td>{row.pctAltoInteres}%</td>
                  <td>{row.pctOportunidadGrande}%</td>
                  <td>{row.pctRequiereIntegracion}%</td>
                  <td>{row.volumenPromedio ?? "No disponible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Ranking de oportunidades</h2>
        <p className="section-description">
          Haz clic en una fila para abrir el detalle del cliente.
        </p>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Puntaje</th>
                <th>Cliente</th>
                <th>Industria</th>
                <th>Caso de uso</th>
                <th>Canal de origen</th>
                <th>Urgencia</th>
                <th>Interés</th>
                <th>Oportunidad</th>
              </tr>
            </thead>
            <tbody>
              {priorityList.map((row) => (
                <tr
                  key={row.id}
                  className="clickable-row"
                  onClick={() => navigate(`/clientes/${row.id}`)}
                >
                  <td>{row.score}</td>
                  <td>{row.nombre}</td>
                  <td>{row.industria}</td>
                  <td>{row.casoUso}</td>
                  <td>{row.canalOrigen}</td>
                  <td>{row.urgencia}</td>
                  <td>{row.interes}</td>
                  <td>{row.oportunidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Desempeño por vendedor</h2>
        <p className="section-description">
          Haz clic en un vendedor para ver solo sus oportunidades.
        </p>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Vendedor</th>
                <th>Oportunidades</th>
                <th>Cerradas</th>
                <th>Tasa de cierre</th>
                <th>Oportunidades de alta calidad</th>
              </tr>
            </thead>
            <tbody>
              {sellerStats.map((row) => (
                <tr
                  key={row.vendedor}
                  className="clickable-row"
                  onClick={() =>
                    navigate(`/clientes?vendedor=${encodeURIComponent(row.vendedor)}`)
                  }
                >
                  <td>{row.vendedor}</td>
                  <td>{row.oportunidades}</td>
                  <td>{row.cerradas}</td>
                  <td>{row.tasaCierre}%</td>
                  <td>{row.oportunidadesAltaCalidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Canal de origen vs calidad</h2>
        <p className="section-description">
          ¿Desde qué canales llegan las mejores oportunidades?
        </p>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Canal de origen</th>
                <th>N° oportunidades</th>
                <th>% alta urgencia</th>
                <th>% alto interés</th>
                <th>% oportunidad grande</th>
              </tr>
            </thead>
            <tbody>
              {originSummary.map((row) => (
                <tr
                  key={row.origin_channel}
                  className="clickable-row"
                  onClick={() =>
                    navigate(`/clientes?canal=${encodeURIComponent(row.origin_channel)}`)
                  }
                >
                  <td>{row.origin_channel}</td>
                  <td>{row.cantidad}</td>
                  <td>{row.pctAltaUrgencia}%</td>
                  <td>{row.pctAltoInteres}%</td>
                  <td>{row.pctOportunidadGrande}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
