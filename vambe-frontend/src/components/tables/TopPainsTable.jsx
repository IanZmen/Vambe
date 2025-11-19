import { useNavigate } from "react-router-dom";
import "../../styles/table.css";

export default function TopPainsTable({ pains }) {
  const navigate = useNavigate();

  return (
    <section className="section">
      <h2 className="section-title">Dolores principales</h2>
      <p className="section-description">
        Muestra los dolores más repetidos entre los clientes. Haz clic para ver las oportunidades asociadas a cada dolor. Haz clic para ver clientes con ese dolor.
      </p>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Dolor</th>
              <th>Frecuencia</th>
              <th>Industria dominante</th>
              <th>Volumen promedio</th>
            </tr>
          </thead>

          <tbody>
            {pains.map((p) => (
              <tr
                key={p.pain}
                className="clickable-row"
                onClick={() =>
                  navigate(`/clientes?dolor=${encodeURIComponent(p.pain)}`)
                }
              >
                <td>{p.pain}</td>
                <td>{p.count}</td>
                <td>{p.mainIndustry}</td>
                <td>{p.avgVolume ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}