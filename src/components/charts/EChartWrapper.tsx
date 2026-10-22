"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface EChartWrapperProps {
  option: echarts.EChartsOption;
  height?: string | number;
  className?: string;
  loading?: boolean;
}

export function EChartWrapper({
  option,
  height = "320px",
  className,
  loading = false,
}: EChartWrapperProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: "canvas",
      });
    }

    const chart = chartInstance.current;

    if (loading) {
      chart.showLoading({
        text: "Memuat data grafik...",
        color: "#0284c7",
        textColor: "#64748b",
        maskColor: "rgba(255, 255, 255, 0.7)",
      });
    } else {
      chart.hideLoading();
      chart.setOption(option, true);
    }

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [option, loading]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className={className}
      style={{
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}
