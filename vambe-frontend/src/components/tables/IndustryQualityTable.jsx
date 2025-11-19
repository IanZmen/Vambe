import { useNavigate } from "react-router-dom";
import "../../styles/table.css";
import "../../styles/page-base.css";

export default function IndustryQualityTable({ rows }) {
  const navigate = useNavigate();

  if (!rows || rows.length === 0) return null;

  return (
    <section className="section">
      <h2 className="section-title">Industria vs calidad de oportunidad</h2>
      <p className="section-description">
        Compara la calidad de las oportunidades por industria para decidir dónde enfocar las prospecciones. Haz clic en una fila para ver los clientes de esa industria.
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
            {rows.map((row) => (
              <tr
                key={row.industry}
                className="clickable-row"
                onClick={() =>
                  navigate(
                    `/clientes?industria=${encodeURIComponent(row.industry)}`
                  )
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
  );
}
