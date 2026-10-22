"use client";

import React, { useMemo } from "react";
import { EChartWrapper } from "./EChartWrapper";
import { HistoricalDataPoint } from "@/lib/data/historicalDataset";
import * as echarts from "echarts";

interface TrafficTrendChartProps {
  data: HistoricalDataPoint[];
  height?: string | number;
}

export function TrafficTrendChart({ data, height = 300 }: TrafficTrendChartProps) {
  const option: echarts.EChartsOption = useMemo(() => {
    const dates = data.map((d) => {
      const parts = d.timestamp.split("T");
      const datePart = parts[0]?.slice(5) || "";
      const timePart = parts[1]?.slice(0, 5) || "";
      return `${datePart} ${timePart}`;
    });

    const speeds = data.map((d) => d.averageSpeedKmh);
    const congestionIndices = data.map((d) => d.congestionIndexScore);

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
              <span>Kecepatan Rata-rata:</span>
              <b>${point.averageSpeedKmh} km/jam</b>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 16px;">
              <span>Indeks Kemacetan:</span>
              <b>${point.congestionIndexScore}%</b>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 4px; font-size: 11px; color: #64748b;">
              <span>Cuaca:</span>
              <span>${point.weatherCondition}</span>
            </div>
            ${
              point.isAnomaly
                ? `<div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #fee2e2; color: #dc2626; font-size: 11px;">
                    ⚠️ ${point.anomalyNote || "Anomali terdeteksi"}
                  </div>`
                : ""
            }
          `;
        },
      },
      legend: {
        data: ["Kecepatan Rata-rata (km/jam)", "Indeks Kemacetan (%)"],
        bottom: 0,
        textStyle: { color: "#64748b", fontSize: 11 },
      },
      grid: {
        top: 24,
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
          name: "km/jam",
          min: 0,
          max: 60,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#f1f5f9" } },
          axisLabel: { color: "#64748b", fontSize: 11 },
        },
        {
          type: "value",
          name: "%",
          min: 0,
          max: 100,
          axisLine: { show: false },
          splitLine: { show: false },
          axisLabel: { color: "#64748b", fontSize: 11 },
        },
      ],
      series: [
        {
          name: "Kecepatan Rata-rata (km/jam)",
          type: "line",
          smooth: true,
          data: speeds,
          itemStyle: { color: "#0284c7" },
          lineStyle: { width: 2.5 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(2, 132, 199, 0.25)" },
              { offset: 1, color: "rgba(2, 132, 199, 0.0)" },
            ]),
          },
        },
        {
          name: "Indeks Kemacetan (%)",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: congestionIndices,
          itemStyle: { color: "#f97316" },
          lineStyle: { width: 2, type: "dashed" },
        },
      ],
    };
  }, [data]);

  return <EChartWrapper option={option} height={height} />;
}
