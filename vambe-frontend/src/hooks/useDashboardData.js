function computeKpis(clients, withCategory) {
  const totalOportunidades = clients.length;
  const conCategoria = withCategory.length;

  const altaUrgencia = withCategory.filter(c => c.category.urgency === "Alta").length;
  const altoInteres = withCategory.filter(c => c.category.interest_level === "Alto").length;

  return {
    totalOportunidades,
    oportunidadesConCategoria: conCategoria,
    altaUrgencia,
    altoInteres,
  };
}

function computeIndustriesSummary(withCategory) {
  const map = new Map();

  for (const c of withCategory) {
    const ind = c.category.industry || "Sin industria";
    if (!map.has(ind)) {
      map.set(ind, {
        industry: ind,
        count: 0,
        altaUrgencia: 0,
        altoInteres: 0,
        grande: 0,
        requiereIntegracion: 0,
        volumeSum: 0,
        volumeCount: 0,
      });
    }
    const v = map.get(ind);
    v.count += 1;
    if (c.category.urgency === "Alta") v.altaUrgencia += 1;
    if (c.category.interest_level === "Alto") v.altoInteres += 1;
    if (c.category.monetary_opportunity === "Grande") v.grande += 1;

    const reqInt = (c.category.requires_integration || "").toLowerCase();
    if (reqInt === "si" || reqInt === "sí") v.requiereIntegracion += 1;

    if (c.category.weekly_volume != null) {
      v.volumeSum += c.category.weekly_volume;
      v.volumeCount += 1;
    }
  }

  return Array.from(map.values()).map(v => ({
    industry: v.industry,
    cantidad: v.count,
    pctAltaUrgencia: v.count ? Math.round((v.altaUrgencia / v.count) * 100) : 0,
    pctAltoInteres: v.count ? Math.round((v.altoInteres / v.count) * 100) : 0,
    pctOportunidadGrande: v.count ? Math.round((v.grande / v.count) * 100) : 0,
    pctRequiereIntegracion: v.count ? Math.round((v.requiereIntegracion / v.count) * 100) : 0,
    volumenPromedio: v.volumeCount ? Math.round(v.volumeSum / v.volumeCount) : null,
  }));
}

function computeOriginSummary(withCategory) {
  const map = new Map();

  for (const c of withCategory) {
    const canal = c.category.origin_channel || "Sin canal";
    if (!map.has(canal)) {
      map.set(canal, {
        origin_channel: canal,
        count: 0,
        altaUrgencia: 0,
        altoInteres: 0,
        grande: 0,
      });
    }
    const v = map.get(canal);
    v.count += 1;
    if (c.category.urgency === "Alta") v.altaUrgencia += 1;
    if (c.category.interest_level === "Alto") v.altoInteres += 1;
    if (c.category.monetary_opportunity === "Grande") v.grande += 1;
  }

  return Array.from(map.values()).map(v => ({
    origin_channel: v.origin_channel,
    cantidad: v.count,
    pctAltaUrgencia: v.count ? Math.round((v.altaUrgencia / v.count) * 100) : 0,
    pctAltoInteres: v.count ? Math.round((v.altoInteres / v.count) * 100) : 0,
    pctOportunidadGrande: v.count ? Math.round((v.grande / v.count) * 100) : 0,
  }));
}

function computePriorityList(withCategory) {
  return withCategory.map(c => {
    const { category } = c;

    const urgScore = category.urgency === "Alta" ? 3 : category.urgency === "Media" ? 2 : 1;
    const intScore = category.interest_level === "Alto" ? 3 : category.interest_level === "Medio" ? 2 : 1;
    const oppScore = category.monetary_opportunity === "Grande"
      ? 3
      : category.monetary_opportunity === "Mediana"
      ? 2
      : 1;

    let score = urgScore + intScore + oppScore;
    if ((category.weekly_volume || 0) >= 500) score += 1;

    return {
      id: c.id,
      nombre: c.name,
      vendedor: c.seller,
      industria: category.industry,
      casoUso: category.use_case,
      canalOrigen: category.origin_channel,
      disparadorCompra: category.purchase_trigger,
      dolorPrincipal: category.main_pain,
      urgencia: category.urgency,
      interes: category.interest_level,
      etapaVenta: category.sales_stage,
      oportunidad: category.monetary_opportunity,
      volumenSemanal: category.weekly_volume,
      requiereIntegracion: category.requires_integration,
      complejidad: category.complexity,
      cerrado: c.closed,
      score,
    };
  }).sort((a, b) => b.score - a.score);
}

function computeSellerStats(withCategory) {
  const map = new Map();

  for (const c of withCategory) {
    const seller = c.seller || "Sin vendedor";
    if (!map.has(seller)) {
      map.set(seller, {
        seller,
        total: 0,
        cerrados: 0,
        altaCalidad: 0,
      });
    }
    const v = map.get(seller);
    v.total += 1;
    if (c.closed) v.cerrados += 1;

    const urgAlta = c.category.urgency === "Alta";
    const intAlto = c.category.interest_level === "Alto";
    if (urgAlta && intAlto) v.altaCalidad += 1;
  }

  return Array.from(map.values()).map(v => ({
    vendedor: v.seller,
    oportunidades: v.total,
    cerradas: v.cerrados,
    tasaCierre: v.total ? Math.round((v.cerrados / v.total) * 100) : 0,
    oportunidadesAltaCalidad: v.altaCalidad,
  }));
}

export function useDashboardData(clients) {
  const withCategory = clients.filter(c => c.category);

  const kpis = computeKpis(clients, withCategory);
  const industriesSummary = computeIndustriesSummary(withCategory);
  const originSummary = computeOriginSummary(withCategory);
  const priorityList = computePriorityList(withCategory);
  const sellerStats = computeSellerStats(withCategory);

  return {
    kpis,
    industriesSummary,
    originSummary,
    priorityList,
    sellerStats,
  };
}
