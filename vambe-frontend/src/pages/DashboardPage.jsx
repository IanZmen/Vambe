import { useEffect, useState } from "react";
import { getClientsWithCategories } from "../services/api";
import { useDashboardData } from "../hooks/useDashboardData";
import KpiCard from "../components/KpiCard";

import IndustryQualityTable from "../components/tables/IndustryQualityTable";
import RankingTable from "../components/tables/RankingTable";
import SellerPerformanceTable from "../components/tables/SellerPerformanceTable";
import OriginQualityTable from "../components/tables/OriginQualityTable";
import TopPainsTable from "../components/tables/TopPainsTable";
import ComplexityValueTable from "../components/tables/ComplexityValueTable";

import ChannelQualityChart from "../components/ChannelQualityChart";

import "../styles/page-base.css";
import "../styles/table.css";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getClientsWithCategories();
      setClients(data);
      setLoading(false);
    }
    load();
  }, []);

  const {
    kpis,
    industriesSummary,
    originSummary,
    priorityList,
    sellerStats,
    painsSummary,
    complexityRows,
  } = useDashboardData(clients);

  if (loading) return <p>Cargando panel...</p>;

  return (
    <div className="page-container">
      {/* KPIs */}
      <section className="section">
        <h2 className="section-title">Resumen general</h2>
        <div className="kpi-grid">
          <KpiCard label="Oportunidades totales" value={kpis.totalOportunidades} />
          <KpiCard label="Con categorías" value={kpis.oportunidadesConCategoria} />
          <KpiCard label="Alta urgencia" value={kpis.altaUrgencia} />
          <KpiCard label="Alto interés" value={kpis.altoInteres} />
        </div>
      </section>

      <IndustryQualityTable rows={industriesSummary} />
      <RankingTable rows={priorityList} />
      <SellerPerformanceTable rows={sellerStats} />
      <OriginQualityTable rows={originSummary} />
      <ChannelQualityChart data={originSummary} />

      <TopPainsTable pains={painsSummary} />
      <ComplexityValueTable rows={complexityRows} />
    </div>
  );
}
