import React from "react";
import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  statusText?: string;
  badgeClass?: string;
  changeText?: string;
  dataLineage?: string;
  detailHref?: string;
  tooltipText?: string;
  icon?: React.ReactNode;
  progressPercent?: number;
  accentColor?: "rose" | "amber" | "emerald" | "sky" | "indigo" | "purple" | "blue";
}

const ACCENT_STYLES = {
  rose: {
    topBar: "bg-gradient-to-r from-rose-500 via-rose-400 to-red-600 shadow-sm shadow-rose-500/40",
    iconBg: "bg-rose-950/60 text-rose-400 border-rose-500/30",
    bar: "bg-rose-500",
    hoverBorder: "hover:border-rose-500/40",
  },
  amber: {
    topBar: "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-600 shadow-sm shadow-amber-500/40",
    iconBg: "bg-amber-950/60 text-amber-400 border-amber-500/30",
    bar: "bg-amber-500",
    hoverBorder: "hover:border-amber-500/40",
  },
  emerald: {
    topBar: "bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-600 shadow-sm shadow-emerald-500/40",
    iconBg: "bg-emerald-950/60 text-emerald-400 border-emerald-500/30",
    bar: "bg-emerald-500",
    hoverBorder: "hover:border-emerald-500/40",
  },
  sky: {
    topBar: "bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 shadow-sm shadow-sky-500/40",
    iconBg: "bg-sky-950/60 text-sky-400 border-sky-500/30",
    bar: "bg-sky-500",
    hoverBorder: "hover:border-sky-500/40",
  },
  indigo: {
    topBar: "bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 shadow-sm shadow-indigo-500/40",
    iconBg: "bg-indigo-950/60 text-indigo-400 border-indigo-500/30",
    bar: "bg-indigo-500",
    hoverBorder: "hover:border-indigo-500/40",
  },
  purple: {
    topBar: "bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-600 shadow-sm shadow-purple-500/40",
    iconBg: "bg-purple-950/60 text-purple-400 border-purple-500/30",
    bar: "bg-purple-500",
    hoverBorder: "hover:border-purple-500/40",
  },
  blue: {
    topBar: "bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-600 shadow-sm shadow-blue-500/40",
    iconBg: "bg-blue-950/60 text-blue-400 border-blue-500/30",
    bar: "bg-blue-500",
    hoverBorder: "hover:border-blue-500/40",
  },
};

export function KpiCard({
  title,
  value,
  unit,
  statusText,
  badgeClass,
  changeText,
  dataLineage,
  detailHref,
  tooltipText,
  icon,
  progressPercent,
  accentColor = "indigo",
}: KpiCardProps) {
  // Infer progress percent if percentage unit
  const computedProgress = progressPercent ?? (unit === "%" && typeof value === "number" ? Math.min(Math.max(value, 0), 100) : null);
  const theme = ACCENT_STYLES[accentColor] || ACCENT_STYLES.indigo;

  return (
    <div className={cn(
      "flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0c1320] p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden",
      theme.hoverBorder
    )}>
      {/* Top subtle highlight */}
      <div className={cn("absolute top-0 left-0 right-0 h-[3px] transition-all opacity-85 group-hover:opacity-100", theme.topBar)} />

      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            {icon && (
              <span className={cn("flex h-6 w-6 items-center justify-center rounded-md border", theme.iconBg)}>
                {icon}
              </span>
            )}
            <span className="font-bold text-slate-300 tracking-wider text-[11px] uppercase font-mono">
              {title}
            </span>
          </div>
          {detailHref && (
            <Link
              href={detailHref}
              className="text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-800/60"
              title="Lihat rincian indikator"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono tabular-nums">
            {value}
          </span>
          {unit && <span className="text-xs font-semibold text-slate-400 font-mono">{unit}</span>}
          {statusText && (
            <span
              className={cn(
                "ml-auto inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold font-mono border",
                badgeClass || "bg-slate-800/80 text-slate-300 border-slate-700"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
              {statusText}
            </span>
          )}
        </div>

        {/* Optional Micro Progress Bar */}
        {computedProgress !== null && (
          <div className="mt-2.5 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", theme.bar)}
              style={{ width: `${computedProgress}%` }}
            />
          </div>
        )}

        {changeText && (
          <div className="mt-2 text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <span>{changeText}</span>
          </div>
        )}
      </div>

      {dataLineage && (
        <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span className="truncate" title={dataLineage}>
            {dataLineage}
          </span>
          {tooltipText && (
            <span title={tooltipText} className="cursor-help text-slate-500 hover:text-slate-300 ml-1">
              <Info className="h-3 w-3" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
