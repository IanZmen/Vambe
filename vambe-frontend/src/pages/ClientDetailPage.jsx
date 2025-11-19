import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById, getCategoryByClientId } from "../services/api";
import "../styles/page-base.css";

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const c = await getClientById(id);
        setClient(c);
        try {
          const cat = await getCategoryByClientId(id);
          setCategory(cat);
        } catch {
          setCategory(null);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p>Cargando cliente...</p>;
  if (!client) return <p>No se encontró el cliente.</p>;

  const irAIndustria = () => {
    if (category?.industry) {
      navigate(`/clientes?industria=${encodeURIComponent(category.industry)}`);
    }
  };

  const irAVendedor = () => {
    if (client.seller) {
      navigate(`/clientes?vendedor=${encodeURIComponent(client.seller)}`);
    }
  };

  const irACanal = () => {
    if (category?.origin_channel) {
      navigate(`/clientes?canal=${encodeURIComponent(category.origin_channel)}`);
    }
  };

  return (
    <div className="page-container">
      <button className="button" onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Volver
      </button>

      <section className="section">
        <h2 className="section-title">Datos del cliente</h2>
        <p><strong>Nombre:</strong> {client.name}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Teléfono:</strong> {client.phone}</p>
        <p><strong>Vendedor asignado:</strong> {client.seller}</p>
        <p><strong>Fecha de reunión:</strong> {client.meeting_date}</p>
        <p><strong>Cerrado:</strong> {client.closed ? "Sí" : "No"}</p>
      </section>

      <section className="section">
        <h2 className="section-title">Insights de oportunidad</h2>
        {category ? (
          <>
            <p><strong>Industria:</strong> {category.industry}</p>
            <p><strong>Caso de uso:</strong> {category.use_case}</p>
            <p><strong>Dolor principal:</strong> {category.main_pain}</p>
            <p><strong>Volumen de consultas por semana:</strong> {category.weekly_volume ?? "No disponible"}</p>
            <p><strong>Canal de origen:</strong> {category.origin_channel}</p>
            <p><strong>Disparador de compra:</strong> {category.purchase_trigger}</p>
            <p><strong>Urgencia percibida:</strong> {category.urgency}</p>
            <p><strong>Nivel de interés:</strong> {category.interest_level}</p>
            <p><strong>Etapa de venta inferida:</strong> {category.sales_stage}</p>
            <p><strong>Tamaño de la oportunidad:</strong> {category.monetary_opportunity}</p>
            <p><strong>Requiere integración:</strong> {category.requires_integration}</p>
            <p><strong>Complejidad de las consultas:</strong> {category.complexity}</p>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
              <button className="button" onClick={irAIndustria}>
                Ver más clientes de esta industria
              </button>
              <button className="button" onClick={irAVendedor}>
                Ver más clientes de este vendedor
              </button>
              <button className="button" onClick={irACanal}>
                Ver más clientes de este canal
              </button>
            </div>
          </>
        ) : (
          <p>Este cliente aún no tiene categorías asociadas.</p>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Comentarios del cliente (transcripción)</h2>
        <div className="transcript-box">
          {client.transcript}
        </div>
      </section>
    </div>
  );
}
