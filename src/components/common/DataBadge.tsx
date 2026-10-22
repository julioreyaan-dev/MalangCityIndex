import React from "react";
import { cn } from "@/lib/utils";

export type DataOriginType =
  | "observed"
  | "calculated"
  | "baseline"
  | "simulation"
  | "forecast"
  | "reference";

interface DataBadgeProps {
  type: DataOriginType;
  className?: string;
  label?: string;
}

export function DataBadge({ type, className, label }: DataBadgeProps) {
  const configs: Record<DataOriginType, { text: string; dot: string; classes: string }> = {
    observed: {
      text: "OBSERVED DATA",
      dot: "bg-emerald-500",
      classes: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    },
    calculated: {
      text: "CALCULATED INDEX",
      dot: "bg-blue-500",
      classes: "bg-blue-50 text-blue-800 border-blue-200/80",
    },
    baseline: {
      text: "HISTORICAL BASELINE",
      dot: "bg-slate-500",
      classes: "bg-slate-100 text-slate-800 border-slate-200",
    },
    simulation: {
      text: "SCENARIO SIMULATION",
      dot: "bg-purple-500",
      classes: "bg-purple-50 text-purple-800 border-purple-200/80",
    },
    forecast: {
      text: "MODEL FORECAST",
      dot: "bg-amber-500",
      classes: "bg-amber-50 text-amber-800 border-amber-200/80",
    },
    reference: {
      text: "REFERENCE DATA",
      dot: "bg-slate-400",
      classes: "bg-slate-50 text-slate-700 border-slate-200",
    },
  };

  const config = configs[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase",
        config.classes,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {label || config.text}
    </span>
  );
}
