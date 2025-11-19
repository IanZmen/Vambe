import { useNavigate } from "react-router-dom";
import "../../styles/table.css";
import "../../styles/page-base.css";

export default function RankingTable({ rows }) {
  const navigate = useNavigate();

  if (!rows || rows.length === 0) return null;

  return (
    <section className="section">
      <h2 className="section-title">Ranking de oportunidades</h2>
      <p className="section-description">
        Ordena las oportunidades según urgencia, interés, tamaño y volumen de consultas. Úsalo para definir a quién llamar primero. Haz clic en una fila para abrir el detalle del cliente.
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
            {rows.map((row) => (
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
  );
}
