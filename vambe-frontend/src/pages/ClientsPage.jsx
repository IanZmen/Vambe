import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getClientsWithCategories } from "../services/api";
import "../styles/page-base.css";
import "../styles/table.css";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const filtroIndustria = searchParams.get("industria") || "";
  const filtroVendedor = searchParams.get("vendedor") || "";
  const filtroUrgencia = searchParams.get("urgencia") || "";
  const filtroCanal = searchParams.get("canal") || "";
  const filtroDolor = searchParams.get("dolor") || "";

  useEffect(() => {
    async function load() {
      const data = await getClientsWithCategories();
      setClients(data);
      setLoading(false);
    }
    load();
  }, []);

  const industrias = useMemo(
    () =>
      Array.from(
        new Set(
          clients
            .map((c) => c.category?.industry)
            .filter(Boolean)
        )
      ),
    [clients]
  );

  const vendedores = useMemo(
    () => Array.from(new Set(clients.map((c) => c.seller).filter(Boolean))),
    [clients]
  );

  const canales = useMemo(
    () =>
      Array.from(
        new Set(
          clients
            .map((c) => c.category?.origin_channel)
            .filter(Boolean)
        )
      ),
    [clients]
  );

  const dolores = useMemo(
    () =>
      Array.from(
        new Set(
          clients
            .map((c) => c.category?.main_pain)
            .filter(Boolean)
        )
      ),
    [clients]
  );

  function actualizarFiltros({
    industria = filtroIndustria,
    vendedor = filtroVendedor,
    urgencia = filtroUrgencia,
    canal = filtroCanal,
    dolor = filtroDolor,
  }) {
    navigate(
      `/clientes?industria=${encodeURIComponent(
        industria
      )}&vendedor=${encodeURIComponent(
        vendedor
      )}&urgencia=${encodeURIComponent(
        urgencia
      )}&canal=${encodeURIComponent(
        canal
      )}&dolor=${encodeURIComponent(dolor)}`
    );
  }

  const filteredClients = useMemo(
    () =>
      clients.filter((c) => {
        if (filtroIndustria && c.category?.industry !== filtroIndustria)
          return false;
        if (filtroVendedor && c.seller !== filtroVendedor) return false;
        if (filtroUrgencia && c.category?.urgency !== filtroUrgencia)
          return false;
        if (filtroCanal && c.category?.origin_channel !== filtroCanal)
          return false;
        if (filtroDolor && c.category?.main_pain !== filtroDolor) return false;
        return true;
      }),
    [
      clients,
      filtroIndustria,
      filtroVendedor,
      filtroUrgencia,
      filtroCanal,
      filtroDolor,
    ]
  );

  const handleRowClick = (id) => {
    navigate(`/clientes/${id}`);
  };

  if (loading) return <p>Cargando clientes...</p>;

  return (
    <div className="page-container">
      <section className="section">
        <h2 className="section-title">Listado de oportunidades</h2>
        <p className="section-description">
          Filtra por industria, vendedor, urgencia, canal de origen y dolor
          principal para encontrar rápidamente las oportunidades relevantes.
        </p>

        <div className="filters-bar">
          <select
            value={filtroIndustria}
            onChange={(e) =>
              actualizarFiltros({ industria: e.target.value })
            }
          >
            <option value="">Todas las industrias</option>
            {industrias.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          <select
            value={filtroVendedor}
            onChange={(e) =>
              actualizarFiltros({ vendedor: e.target.value })
            }
          >
            <option value="">Todos los vendedores</option>
            {vendedores.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={filtroUrgencia}
            onChange={(e) =>
              actualizarFiltros({ urgencia: e.target.value })
            }
          >
            <option value="">Todas las urgencias</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <select
            value={filtroCanal}
            onChange={(e) =>
              actualizarFiltros({ canal: e.target.value })
            }
          >
            <option value="">Todos los canales</option>
            {canales.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filtroDolor}
            onChange={(e) =>
              actualizarFiltros({ dolor: e.target.value })
            }
          >
            <option value="">Todos los dolores</option>
            {dolores.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Industria</th>
                <th>Canal de origen</th>
                <th>Urgencia</th>
                <th>Interés</th>
                <th>Oportunidad</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c) => (
                <tr
                  key={c.id}
                  className="clickable-row"
                  onClick={() => handleRowClick(c.id)}
                >
                  <td>{c.name}</td>
                  <td>{c.seller}</td>
                  <td>{c.category?.industry}</td>
                  <td>{c.category?.origin_channel}</td>
                  <td>{c.category?.urgency}</td>
                  <td>{c.category?.interest_level}</td>
                  <td>{c.category?.monetary_opportunity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
