import { useNavigate } from "react-router-dom";
import "../../styles/table.css";
import "../../styles/page-base.css";

export default function SellerPerformanceTable({ rows }) {
  const navigate = useNavigate();

  if (!rows || rows.length === 0) return null;

  return (
    <section className="section">
      <h2 className="section-title">Desempeño por vendedor</h2>
      <p className="section-description">
        Mide el desempeño de cada vendedor en volumen, cierres y calidad de oportunidades. Haz clic en un vendedor para ver solo sus oportunidades.
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
            {rows.map((row) => (
              <tr
                key={row.vendedor}
                className="clickable-row"
                onClick={() =>
                  navigate(
                    `/clientes?vendedor=${encodeURIComponent(row.vendedor)}`
                  )
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
  );
}
