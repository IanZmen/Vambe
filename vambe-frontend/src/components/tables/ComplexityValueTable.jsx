import { useNavigate } from "react-router-dom";
import "../../styles/table.css";

export default function ComplexityValueTable({ rows }) {
  const navigate = useNavigate();

  if (!rows || rows.length === 0) return null;

  return (
    <section className="section">
      <h2 className="section-title">Complejidad vs valor</h2>
      <p className="section-description">
        Compara el esfuerzo esperado (complejidad de las consultas) con el valor
        potencial de la oportunidad. Haz clic en una fila para ir al detalle del
        cliente.
      </p>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Industria</th>
              <th>Complejidad</th>
              <th>Oportunidad monetaria</th>
              <th>Integración</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="clickable-row"
                onClick={() => navigate(`/clientes/${r.id}`)}
              >
                <td>{r.name}</td>
                <td>{r.industry}</td>
                <td>{r.complexity}</td>
                <td>{r.monetary}</td>
                <td>{r.integration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
