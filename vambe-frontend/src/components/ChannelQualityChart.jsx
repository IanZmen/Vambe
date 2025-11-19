import { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./ChannelQualityChart.css";

export default function ChannelQualityChart({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svgEl = svgRef.current;
    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 280;
    const margin = { top: 20, right: 20, bottom: 70, left: 50 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.origin_channel))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.cantidad) || 0])
      .nice()
      .range([innerHeight, 0]);

    const color = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, (d) => d.pctAltoInteres) || 100]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end")
      .style("font-size", "10px");

    g.append("g").call(d3.axisLeft(y).ticks(5));

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "channel-bar")
      .attr("x", (d) => x(d.origin_channel))
      .attr("y", (d) => y(d.cantidad))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.cantidad))
      .attr("fill", (d) => color(d.pctAltoInteres));

    g.selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x(d.origin_channel) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.cantidad) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text((d) => d.cantidad);
  }, [data]);

  return (
    <section className="section">
      <h2 className="section-title">Calidad por canal de origen</h2>
      <p className="section-description">
        Altura de la barra = número de oportunidades. Color = % de alto interés
        (más oscuro = mejor canal).
      </p>
      <div className="chart-wrapper">
        <svg ref={svgRef} width={600} height={280} />
      </div>
    </section>
  );
}
