"use client";

import React, { useMemo } from "react";
import { EChartWrapper } from "./EChartWrapper";
import { HistoricalDataPoint } from "@/lib/data/historicalDataset";
import * as echarts from "echarts";

interface AirQualityChartProps {
  data: HistoricalDataPoint[];
  height?: string | number;
}

export function AirQualityChart({ data, height = 300 }: AirQualityChartProps) {
  const option: echarts.EChartsOption = useMemo(() => {
    const dates = data.map((d) => {
      const parts = d.timestamp.split("T");
      const datePart = parts[0]?.slice(5) || "";
      const timePart = parts[1]?.slice(0, 5) || "";
      return `${datePart} ${timePart}`;
    });

    const pm25Values = data.map((d) => d.pm25Concentration);
    const ispuScores = data.map((d) => d.ispuScore);

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        textStyle: { color: "#0f172a", fontSize: 12 },
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return "";
          const idx = params[0].dataIndex;
          const point = data[idx];
          return `
            <div style="font-weight: 600; margin-bottom: 4px;">${dates[idx]} WIB</div>
            <div style="display: flex; justify-content: space-between; gap: 16px;">
              <span>PM2.5:</span>
              <b>${point.pm25Concentration} µg/m³</b>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 16px;">
              <span>Skor ISPU:</span>
              <b>${point.ispuScore} (${point.ispuCategory})</b>
            </div>
            <div style="margin-top: 4px; font-size: 11px; color: #64748b;">
              Standar WHO 24h: 15 µg/m³ • Baku Mutu PP 22/2021: 55 µg/m³
            </div>
          `;
        },
      },
      legend: {
        data: ["Konsentrasi PM2.5 (µg/m³)", "Skor ISPU"],
        bottom: 0,
        textStyle: { color: "#64748b", fontSize: 11 },
      },
      grid: {
        top: 30,
        left: "3%",
        right: "4%",
        bottom: 40,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: "#cbd5e1" } },
        axisLabel: { color: "#64748b", fontSize: 10 },
      },
      yAxis: [
        {
          type: "value",
          name: "µg/m³",
          min: 0,
          max: 70,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#f1f5f9" } },
          axisLabel: { color: "#64748b", fontSize: 11 },
        },
        {
          type: "value",
          name: "ISPU",
          min: 0,
          max: 150,
          axisLine: { show: false },
          splitLine: { show: false },
          axisLabel: { color: "#64748b", fontSize: 11 },
        },
      ],
      series: [
        {
          name: "Konsentrasi PM2.5 (µg/m³)",
          type: "line",
          smooth: true,
          data: pm25Values,
          itemStyle: { color: "#10b981" },
          lineStyle: { width: 2.5 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(16, 185, 129, 0.25)" },
              { offset: 1, color: "rgba(16, 185, 129, 0.0)" },
            ]),
          },
          markLine: {
            symbol: "none",
            data: [
              {
                yAxis: 15,
                lineStyle: { color: "#3b82f6", type: "dashed", width: 1.5 },
                label: { formatter: "Panduan WHO (15 µg/m³)", position: "insideEndTop", fontSize: 10 },
              },
              {
                yAxis: 55,
                lineStyle: { color: "#ef4444", type: "dotted", width: 1.5 },
                label: { formatter: "Baku Mutu RI (55 µg/m³)", position: "insideEndTop", fontSize: 10 },
              },
            ],
          },
        },
        {
          name: "Skor ISPU",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: ispuScores,
          itemStyle: { color: "#6366f1" },
          lineStyle: { width: 2 },
        },
      ],
    };
  }, [data]);

  return <EChartWrapper option={option} height={height} />;
}
