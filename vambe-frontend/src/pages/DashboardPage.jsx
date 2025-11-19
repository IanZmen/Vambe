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
import SellerComparisonChart from "../components/SellerComparisonChart";
import IndustryOpportunityQuadrant from "../components/IndustryOpportunityQuadrant";

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
    sellerIndustryStats,
  } = useDashboardData(clients);

  if (loading) return <p>Cargando panel...</p>;

  return (
    <div className="page-container dashboard-page">
      <section className="section section-heading">
        <div>
          <h2 className="section-title">Resumen general</h2>
          <p className="section-description">
            KPIs en tiempo real y, justo debajo, la comparativa de vendedores por industria para priorizar.
          </p>
        </div>
        <div className="kpi-grid">
          <KpiCard label="Oportunidades totales" value={kpis.totalOportunidades} />
          <KpiCard label="Con categorías" value={kpis.oportunidadesConCategoria} />
          <KpiCard label="Alta urgencia" value={kpis.altaUrgencia} />
          <KpiCard label="Alto interés" value={kpis.altoInteres} />
        </div>
      </section>

      <SellerComparisonChart clients={clients} />
      <SellerPerformanceTable rows={sellerStats} />
      <IndustryOpportunityQuadrant rows={industriesSummary} />
      <IndustryQualityTable rows={industriesSummary} />
      <RankingTable rows={priorityList} />

      <OriginQualityTable rows={originSummary} />
      <ChannelQualityChart data={originSummary} />
      <TopPainsTable pains={painsSummary} />
      <ComplexityValueTable rows={complexityRows} />
    </div>
  );
}
