
import { useMemo } from "react";

export function useDashboardData(clients) {
  const kpis = useMemo(() => {
    const total = clients.length;
    const conCategoria = clients.filter((c) => c.category).length;
    const altaUrgencia = clients.filter(
      (c) => c.category?.urgency === "Alta"
    ).length;
    const altoInteres = clients.filter(
      (c) => c.category?.interest_level === "Alto"
    ).length;

    return {
      totalOportunidades: total,
      oportunidadesConCategoria: conCategoria,
      altaUrgencia,
      altoInteres,
    };
  }, [clients]);

  const industriesSummary = useMemo(() => {
    const map = new Map();

    for (const c of clients) {
      const cat = c.category;
      if (!cat || !cat.industry) continue;

      const key = cat.industry;
      if (!map.has(key)) {
        map.set(key, {
          industry: key,
          cantidad: 0,
          altaUrgencia: 0,
          altoInteres: 0,
          oportunidadGrande: 0,
          requiereIntegracion: 0,
          volumenTotal: 0,
          volumenCount: 0,
        });
      }

      const item = map.get(key);
      item.cantidad += 1;

      if (cat.urgency === "Alta") item.altaUrgencia += 1;
      if (cat.interest_level === "Alto") item.altoInteres += 1;
      if (cat.monetary_opportunity === "Grande")
        item.oportunidadGrande += 1;
      if (cat.requires_integration === "Sí" || cat.requires_integration === "Si")
        item.requiereIntegracion += 1;

      if (typeof cat.weekly_volume === "number") {
        item.volumenTotal += cat.weekly_volume;
        item.volumenCount += 1;
      }
    }

    return Array.from(map.values()).map((item) => ({
      industry: item.industry,
      cantidad: item.cantidad,
      pctAltaUrgencia: item.cantidad
        ? Math.round((item.altaUrgencia / item.cantidad) * 100)
        : 0,
      pctAltoInteres: item.cantidad
        ? Math.round((item.altoInteres / item.cantidad) * 100)
        : 0,
      pctOportunidadGrande: item.cantidad
        ? Math.round((item.oportunidadGrande / item.cantidad) * 100)
        : 0,
      pctRequiereIntegracion: item.cantidad
        ? Math.round((item.requiereIntegracion / item.cantidad) * 100)
        : 0,
      volumenPromedio: item.volumenCount
        ? Math.round(item.volumenTotal / item.volumenCount)
        : null,
    }));
  }, [clients]);

  const originSummary = useMemo(() => {
    const map = new Map();

    for (const c of clients) {
      const cat = c.category;
      if (!cat || !cat.origin_channel) continue;

      const key = cat.origin_channel;
      if (!map.has(key)) {
        map.set(key, {
          origin_channel: key,
          cantidad: 0,
          altaUrgencia: 0,
          altoInteres: 0,
          oportunidadGrande: 0,
        });
      }

      const item = map.get(key);
      item.cantidad += 1;
      if (cat.urgency === "Alta") item.altaUrgencia += 1;
      if (cat.interest_level === "Alto") item.altoInteres += 1;
      if (cat.monetary_opportunity === "Grande")
        item.oportunidadGrande += 1;
    }

    return Array.from(map.values()).map((item) => ({
      origin_channel: item.origin_channel,
      cantidad: item.cantidad,
      pctAltaUrgencia: item.cantidad
        ? Math.round((item.altaUrgencia / item.cantidad) * 100)
        : 0,
      pctAltoInteres: item.cantidad
        ? Math.round((item.altoInteres / item.cantidad) * 100)
        : 0,
      pctOportunidadGrande: item.cantidad
        ? Math.round((item.oportunidadGrande / item.cantidad) * 100)
        : 0,
    }));
  }, [clients]);

  const priorityList = useMemo(() => {
    return clients
      .filter((c) => c.category)
      .map((c) => {
        const cat = c.category;
        let score = 0;

        if (cat.urgency === "Alta") score += 40;
        if (cat.urgency === "Media") score += 20;

        if (cat.interest_level === "Alto") score += 30;
        if (cat.monetary_opportunity === "Grande") score += 30;

        if (typeof cat.weekly_volume === "number") {
          score += Math.min(cat.weekly_volume / 50, 20);
        }

        return {
          id: c.id,
          score: Math.round(score),
          nombre: c.name,
          industria: cat.industry,
          casoUso: cat.use_case,
          canalOrigen: cat.origin_channel,
          urgencia: cat.urgency,
          interes: cat.interest_level,
          oportunidad: cat.monetary_opportunity,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [clients]);

  const sellerStats = useMemo(() => {
    const map = new Map();

    for (const c of clients) {
      if (!c.seller) continue;
      const key = c.seller;

      if (!map.has(key)) {
        map.set(key, {
          vendedor: key,
          oportunidades: 0,
          cerradas: 0,
          oportunidadesAltaCalidad: 0,
        });
      }

      const item = map.get(key);
      item.oportunidades += 1;
      if (c.closed) item.cerradas += 1;

      const cat = c.category;
      if (
        cat &&
        cat.urgency === "Alta" &&
        cat.interest_level === "Alto" &&
        cat.monetary_opportunity === "Grande"
      ) {
        item.oportunidadesAltaCalidad += 1;
      }
    }

    return Array.from(map.values()).map((item) => ({
      ...item,
      tasaCierre: item.oportunidades
        ? Math.round((item.cerradas / item.oportunidades) * 100)
        : 0,
    }));
  }, [clients]);

  const painsSummary = useMemo(() => {
    const map = new Map();

    for (const c of clients) {
      const cat = c.category;
      if (!cat || !cat.main_pain) continue;

      const key = cat.main_pain;
      if (!map.has(key)) {
        map.set(key, {
          pain: key,
          count: 0,
          volumenTotal: 0,
          volumenCount: 0,
          industrias: {},
        });
      }

      const item = map.get(key);
      item.count += 1;

      if (typeof cat.weekly_volume === "number") {
        item.volumenTotal += cat.weekly_volume;
        item.volumenCount += 1;
      }

      if (cat.industry) {
        item.industrias[cat.industry] =
          (item.industrias[cat.industry] || 0) + 1;
      }
    }

    return Array.from(map.values()).map((item) => {
      const mainIndustry =
        Object.entries(item.industrias).sort((a, b) => b[1] - a[1])[0]?.[0] ??
        "N/A";

      return {
        pain: item.pain,
        count: item.count,
        mainIndustry,
        avgVolume: item.volumenCount
          ? Math.round(item.volumenTotal / item.volumenCount)
          : null,
      };
    });
  }, [clients]);

  const complexityRows = useMemo(() => {
    return clients
      .filter((c) => c.category)
      .map((c) => {
        const cat = c.category;
        return {
          id: c.id,
          name: c.name,
          industry: cat.industry,
          complexity: cat.complexity || "N/A",
          monetary: cat.monetary_opportunity,
          integration: cat.requires_integration,
        };
      });
  }, [clients]);

  return {
    kpis,
    industriesSummary,
    originSummary,
    priorityList,
    sellerStats,
    painsSummary,
    complexityRows,
  };
}
