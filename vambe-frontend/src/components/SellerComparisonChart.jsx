import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import "../styles/page-base.css";
import "../styles/table.css";
import "./SellerComparisonChart.css";

export default function SellerComparisonChart({ clients }) {
  const svgRef = useRef(null);

  const allSellers = useMemo(() => {
    const set = new Set();
    for (const c of clients) {
      if (c.seller) set.add(c.seller);
    }
    return Array.from(set);
  }, [clients]);

  const [selectedSellers, setSelectedSellers] = useState([]);

  useEffect(() => {
    setSelectedSellers((prev) =>
      prev.length ? prev : allSellers.slice(0, Math.min(4, allSellers.length))
    );
  }, [allSellers]);

  const toggleSeller = (seller) => {
    setSelectedSellers((prev) => {
      if (prev.includes(seller)) {
        return prev.filter((s) => s !== seller);
      }
      if (prev.length >= 4) return prev;
      return [...prev, seller];
    });
  };

  const stats = useMemo(() => {
    const result = {};
    for (const c of clients) {
      const seller = c.seller;
      const cat = c.category;
      if (!seller || !cat?.industry) continue;

      if (!result[seller]) result[seller] = {};
      if (!result[seller][cat.industry]) {
        result[seller][cat.industry] = {
          oportunidades: 0,
          cerradas: 0,
        };
      }
      const st = result[seller][cat.industry];
      st.oportunidades += 1;
      if (c.closed) st.cerradas += 1;
    }
    return result;
  }, [clients]);

  const industries = useMemo(() => {
    const set = new Set();
    for (const seller of selectedSellers) {
      const byInd = stats[seller] || {};
      Object.keys(byInd).forEach((ind) => set.add(ind));
    }
    return Array.from(set);
  }, [selectedSellers, stats]);

  const maxOpps = useMemo(() => {
    let max = 0;
    for (const industry of industries) {
      for (const seller of selectedSellers) {
        const st = stats[seller]?.[industry];
        if (st && st.oportunidades > max) max = st.oportunidades;
      }
    }
    return max || 1;
  }, [industries, selectedSellers, stats]);

  useEffect(() => {
    if (!svgRef.current || !industries.length || !selectedSellers.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 900;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 80, left: 50 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x0 = d3
      .scaleBand()
      .domain(industries)
      .range([0, innerWidth])
      .paddingInner(0.2);

    const x1 = d3
      .scaleBand()
      .domain(selectedSellers)
      .range([0, x0.bandwidth()])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, maxOpps])
      .nice()
      .range([innerHeight, 0]);

    const colors = [
      "#2563eb",
      "#16a34a",
      "#f97316",
      "#a855f7",
      "#dc2626",
      "#0ea5e9",
    ];
    const colorScale = d3
      .scaleOrdinal()
      .domain(selectedSellers)
      .range(colors.slice(0, selectedSellers.length));

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-25)")
      .style("text-anchor", "end");

    g.append("g").call(d3.axisLeft(y));

    const industryGroups = g
      .selectAll(".industry-group")
      .data(industries)
      .enter()
      .append("g")
      .attr("class", "industry-group")
      .attr("transform", (d) => `translate(${x0(d)},0)`);

    industryGroups
      .selectAll("rect")
      .data((industry) =>
        selectedSellers.map((seller) => ({
          industry,
          seller,
        }))
      )
      .enter()
      .append("rect")
      .attr("x", (d) => x1(d.seller))
      .attr("y", (d) => {
        const st = stats[d.seller]?.[d.industry];
        const val = st?.oportunidades || 0;
        return y(val);
      })
      .attr("width", x1.bandwidth())
      .attr("height", (d) => {
        const st = stats[d.seller]?.[d.industry];
        const val = st?.oportunidades || 0;
        return innerHeight - y(val);
      })
      .attr("fill", (d) => colorScale(d.seller));

    const labelGroups = industryGroups
      .selectAll(".bar-label")
      .data((industry) =>
        selectedSellers
          .map((seller) => ({
            industry,
            seller,
            stats: stats[seller]?.[industry],
          }))
          .filter((item) => item.stats?.oportunidades)
      )
      .enter()
      .append("g")
      .attr("class", "bar-label")
      .attr("transform", (d) => {
        const val = d.stats.oportunidades;
        const sellerIdx = selectedSellers.indexOf(d.seller);
        const offset = 14 + sellerIdx * 16;
        const xPos = x1(d.seller) + x1.bandwidth() / 2;
        const yPos = y(val) - offset;
        return `translate(${xPos}, ${yPos})`;
      });

    labelGroups
      .append("circle")
      .attr("r", 12)
      .attr("fill", (d) => colorScale(d.seller))
      .attr("opacity", 0.95);

    labelGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", 10)
      .text((d) => {
        const eff = Math.round((d.stats.cerradas / d.stats.oportunidades) * 100);
        return `${eff}%`;
      });

    const legend = g
      .append("g")
      .attr("transform", `translate(0, -20)`)
      .attr("class", "legend");

    selectedSellers.forEach((seller, i) => {
      const lg = legend
        .append("g")
        .attr("transform", `translate(${i * 150},0)`);

      lg.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", colorScale(seller));

      lg.append("text")
        .attr("x", 20)
        .attr("y", 11)
        .attr("font-size", 11)
        .text(seller);
    });
  }, [industries, selectedSellers, stats, maxOpps]);

  if (!allSellers.length) return null;

  return (
    <section className="section">
      <h2 className="section-title">Comparar vendedores por industria</h2>
      <p className="section-description">
        Altura de la barra = número de oportunidades en esa industria. Número
        sobre la barra = tasa de cierre (%).
      </p>

      <div className="seller-filters">
        {allSellers.map((seller) => (
          <label key={seller} className="seller-chip">
            <input
              type="checkbox"
              checked={selectedSellers.includes(seller)}
              onChange={() => toggleSeller(seller)}
            />
            <span>{seller}</span>
          </label>
        ))}
        <span className="seller-filters-hint">
          (máximo 4 vendedores seleccionados)
        </span>
      </div>

      <div className="chart-container">
        <svg ref={svgRef} className="seller-chart-svg" />
      </div>
    </section>
  );
}
