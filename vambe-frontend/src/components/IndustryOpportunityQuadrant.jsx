import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import "./IndustryOpportunityQuadrant.css";

const CHART_WIDTH = 960;
const CHART_HEIGHT = 480;
const CHART_MARGIN = { top: 40, right: 90, bottom: 120, left: 110 };

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getUrgencyColor = (percentage) => {
  const t = clamp((percentage || 0) / 100, 0, 1);
  const start = d3.rgb(37, 99, 235);
  const end = d3.rgb(239, 68, 68);
  return d3.interpolateRgb(start, end)(t);
};

const clusterIndustries = (points, volumeBucketSize, opportunityBucketSize) => {
  const bucketMap = new Map();

  points.forEach((point) => {
    const bucketX = Math.round((point.volume || 0) / volumeBucketSize);
    const bucketY = Math.round((point.opportunity || 0) / opportunityBucketSize);
    const bucketKey = `${bucketX}-${bucketY}`;
    if (!bucketMap.has(bucketKey)) bucketMap.set(bucketKey, []);
    bucketMap.get(bucketKey).push(point);
  });

  return Array.from(bucketMap.values()).map((group) => {
    if (group.length === 1) return { ...group[0], isCluster: false };

    const totalWeight = group.reduce((sum, item) => sum + (item.count || 1), 0) || group.length;
    const weightedAverage = (field) =>
      group.reduce((sum, item) => sum + (item[field] || 0) * (item.count || 1), 0) / totalWeight;

    const industries = group.flatMap((item) => item.industries || [item.label]);
    const preview =
      industries.length <= 2
        ? industries.join(" · ")
        : `${industries.slice(0, 2).join(" · ")} +${industries.length - 2}`;

    return {
      label: preview,
      industries,
      volume: weightedAverage("volume"),
      opportunity: weightedAverage("opportunity"),
      urgency: weightedAverage("urgency"),
      interest: weightedAverage("interest"),
      count: totalWeight,
      isCluster: true,
    };
  });
};

export default function IndustryOpportunityQuadrant({ rows }) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  const preparedPoints = useMemo(() => {
    if (!rows || rows.length === 0) {
      return { maxVolume: 0, avgVolume: 0, avgOpportunity: 0, points: [] };
    }

    const basePoints = rows.map((row) => ({
      label: row.industry,
      industries: [row.industry],
      volume: row.volumenPromedio ?? 0,
      opportunity: row.pctOportunidadGrande ?? 0,
      urgency: row.pctAltaUrgencia ?? 0,
      interest: row.pctAltoInteres ?? 0,
      count: row.cantidad || 0,
    }));

    const maxVolume = d3.max(basePoints, (point) => point.volume) || 10;
    const avgVolume = d3.mean(basePoints, (point) => point.volume) || 0;
    const avgOpportunity = d3.mean(basePoints, (point) => point.opportunity) || 0;

    const volumeBucketSize = Math.max(maxVolume / 8, 25);
    const opportunityBucketSize = 8;

    const clustered = clusterIndustries(basePoints, volumeBucketSize, opportunityBucketSize);

    return {
      maxVolume,
      avgVolume,
      avgOpportunity,
      points: clustered,
    };
  }, [rows]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svgElement = d3.select(svgRef.current);
    const tooltipElement = d3.select(tooltipRef.current);
    svgElement.selectAll("*").remove();
    tooltipElement.style("opacity", 0);

    if (!preparedPoints.points.length) return;

    const innerWidth = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
    const innerHeight = CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;

    const xScale = d3
      .scaleLinear()
      .domain([0, preparedPoints.maxVolume || 1])
      .nice()
      .range([CHART_MARGIN.left, CHART_WIDTH - CHART_MARGIN.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .nice()
      .range([CHART_HEIGHT - CHART_MARGIN.bottom, CHART_MARGIN.top]);

    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(preparedPoints.points, (point) => point.count) || 1])
      .range([10, 34]);

    const gridGroup = svgElement.append("g").attr("class", "quadrant-grid-group");

    const axisBottom = d3
      .axisBottom(xScale)
      .ticks(6)
      .tickSize(-innerHeight)
      .tickFormat(d3.format("~s"));
    gridGroup
      .append("g")
      .attr("transform", `translate(0, ${CHART_HEIGHT - CHART_MARGIN.bottom})`)
      .call(axisBottom)
      .call((axis) => axis.select(".domain").remove())
      .call((axis) => axis.selectAll("line").attr("stroke", "rgba(15,23,42,0.08)"));

    const axisLeft = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-innerWidth)
      .tickFormat((value) => `${value}%`);
    gridGroup
      .append("g")
      .attr("transform", `translate(${CHART_MARGIN.left},0)`)
      .call(axisLeft)
      .call((axis) => axis.select(".domain").remove())
      .call((axis) => axis.selectAll("line").attr("stroke", "rgba(15,23,42,0.08)"));

    svgElement
      .append("text")
      .attr("class", "quadrant-axis-label")
      .attr("x", CHART_MARGIN.left + innerWidth / 2)
      .attr("y", CHART_HEIGHT - 40)
      .text("Volumen promedio de consultas");

    svgElement
      .append("text")
      .attr("class", "quadrant-axis-label")
      .attr("transform", `rotate(-90)`)
      .attr("x", -(CHART_MARGIN.top + innerHeight / 2))
      .attr("y", 40)
      .text("% oportunidades grandes");

    svgElement
      .append("line")
      .attr("class", "quadrant-divider")
      .attr("x1", xScale(preparedPoints.avgVolume))
      .attr("y1", CHART_MARGIN.top)
      .attr("x2", xScale(preparedPoints.avgVolume))
      .attr("y2", CHART_HEIGHT - CHART_MARGIN.bottom);

    svgElement
      .append("line")
      .attr("class", "quadrant-divider")
      .attr("x1", CHART_MARGIN.left)
      .attr("y1", yScale(preparedPoints.avgOpportunity))
      .attr("x2", CHART_WIDTH - CHART_MARGIN.right)
      .attr("y2", yScale(preparedPoints.avgOpportunity));

    const bubbleGroup = svgElement.append("g").attr("class", "quadrant-bubbles-group");

    const bubbleData = preparedPoints.points.map((point) => {
      const cx = xScale(point.volume || 0);
      const cy = yScale(point.opportunity || 0);
      const radius = radiusScale(point.count || 0);
      const labelY = clamp(
        cy - radius - 8,
        CHART_MARGIN.top + 12,
        CHART_HEIGHT - CHART_MARGIN.bottom - 6
      );

      return {
        ...point,
        cx,
        cy,
        radius,
        labelY,
        fillColor: getUrgencyColor(point.urgency),
        fillOpacity: 0.45 + ((point.interest || 0) / 100) * 0.45,
        strokeOpacity: 0.3 + ((point.interest || 0) / 100) * 0.6,
        strokeWidth: 1 + ((point.interest || 0) / 100) * 3,
      };
    });

    const bubbleNodes = bubbleGroup
      .selectAll(".quadrant-point")
      .data(bubbleData)
      .enter()
      .append("g")
      .attr("class", "quadrant-point");

    bubbleNodes
      .append("circle")
      .attr("cx", (point) => point.cx)
      .attr("cy", (point) => point.cy)
      .attr("r", (point) => point.radius)
      .attr("fill", (point) => point.fillColor)
      .attr("fill-opacity", (point) => point.fillOpacity)
      .attr("stroke", (point) => point.fillColor)
      .attr("stroke-opacity", (point) => point.strokeOpacity)
      .attr("stroke-width", (point) => point.strokeWidth)
      .on("mouseenter", (event, point) => {
        if (!point.industries || point.industries.length <= 1) return;
        const [x, y] = d3.pointer(event, svgRef.current);
        tooltipElement
          .style("opacity", 1)
          .style("left", `${x + 14}px`)
          .style("top", `${y}px`)
          .html(
            `<strong>${point.label}</strong><br/>${point.industries
              .map((item) => `<span>${item}</span>`)
              .join("<br/>")}`
          );
      })
      .on("mousemove", (event, point) => {
        if (!point.industries || point.industries.length <= 1) return;
        const [x, y] = d3.pointer(event, svgRef.current);
        tooltipElement.style("left", `${x + 14}px`).style("top", `${y}px`);
      })
      .on("mouseleave", () => {
        tooltipElement.style("opacity", 0);
      });

    bubbleNodes
      .append("text")
      .attr("class", "quadrant-label")
      .attr("x", (point) => point.cx)
      .attr("y", (point) => point.labelY)
      .attr("text-anchor", "middle")
      .text((point) => point.label);
  }, [preparedPoints]);

  if (!rows || rows.length === 0) return null;

  return (
    <section className="section quadrant-section">
      <div className="quadrant-header">
        <div>
          <h2 className="section-title">Cuadrante de oportunidad por industria</h2>
          <p className="section-description">
            X = volumen promedio (TAM), Y = % oportunidades grandes. Burbujas escalan con # de oportunidades,
            color según urgencia y borde/opacity según interés. Agrupamos industrias cercanas para evitar solaparlas.
          </p>
        </div>
      </div>

      <div className="quadrant-chart-wrapper">
        <svg ref={svgRef} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} />
        <div ref={tooltipRef} className="quadrant-tooltip" />
      </div>

      <div className="quadrant-bottom-legend">
        <div>
          <span className="legend-title">Color → % de urgencia alta</span>
          <div className="quadrant-gradient">
            <span>Baja</span>
            <div className="quadrant-gradient-bar" />
            <span>Alta</span>
          </div>
        </div>
        <div className="legend-details">
          <span>Borde / opacidad → % de interés alto.</span>
          <span>Tamaño → número total de oportunidades.</span>
        </div>
      </div>
    </section>
  );
}
