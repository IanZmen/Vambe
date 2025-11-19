import { useNavigate } from "react-router-dom";
import "../../styles/table.css";
import "../../styles/page-base.css";

export default function OriginQualityTable({ rows }) {
  const navigate = useNavigate();

  if (!rows || rows.length === 0) return null;

  return (
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
            {rows.map((row) => (
              <tr
                key={row.origin_channel}
                className="clickable-row"
                onClick={() =>
                  navigate(
                    `/clientes?canal=${encodeURIComponent(row.origin_channel)}`
                  )
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
  );
}
