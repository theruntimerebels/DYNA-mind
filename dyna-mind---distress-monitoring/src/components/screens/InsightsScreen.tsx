import React, { useState } from 'react';
import {
  TrendingDown,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { ASSETS } from '../../data/mockData';
import { BiometricIndicators } from '../../types';

interface InsightsScreenProps {
  biometrics: BiometricIndicators;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ biometrics }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'case' | 'custom'>('7d');
  const [activePointIndex, setActivePointIndex] = useState<number | null>(3);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const dataPoints = [
    { day: 'Mon', val: 24, note: 'Normal resting state' },
    { day: 'Tue', val: 28, note: 'Mild morning tension' },
    { day: 'Wed', val: 32, note: 'Legal email review' },
    { day: 'Thu', val: 62, note: 'Court Notice Received (Acute Spike)' },
    { day: 'Fri', val: 46, note: 'Began 4-7-8 Somatic regulation' },
    { day: 'Sat', val: 38, note: 'Companion debrief session' },
    { day: 'Sun', val: 34, note: 'Current anchored baseline' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-2" id="insights-screen">
      {/* Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
            Neuropsychological Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-headline">
            My Insights
          </h1>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container border border-surface-container-high self-start">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: 'case', label: 'Case Timeline' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                timeframe === tf.id
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Personal Baseline Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-secondary tracking-wider uppercase">
                Dynamic Personal Baseline
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary font-bold text-[10px]">
                v2.4
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-primary font-headline">
                {biometrics.stabilityQuotient}%
              </span>
              <span className="text-[14px] font-semibold text-emerald-700">
                Anchored Status
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-on-surface-variant block">Deviation Variance</span>
            <span className="text-[13px] font-bold text-primary flex items-center justify-end gap-0.5">
              <TrendingDown className="w-3.5 h-3.5 text-secondary" />
              +14% anticipated
            </span>
          </div>
        </div>

        {/* Safe Adaptive Corridor Visualizer */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] text-on-surface-variant">
            <span>Critical De-escalation</span>
            <span>Adaptive Corridor</span>
            <span>Optimal Regulation</span>
          </div>
          <div className="relative w-full h-3 rounded-full bg-surface-container overflow-hidden">
            {/* Safe zone band in middle */}
            <div className="absolute left-[40%] right-[20%] inset-y-0 bg-secondary-container/80 rounded-sm" />
            {/* Current marker */}
            <div
              className="absolute top-0 bottom-0 w-2.5 bg-primary rounded-full shadow-md"
              style={{ left: `${biometrics.stabilityQuotient}%` }}
            />
          </div>
        </div>

        <p className="text-[13px] text-on-surface-variant leading-relaxed">
          Autonomic indicators maintain equilibrium within the calibrated comfort band. Somatic variance remains predictable ahead of the hearing.
        </p>
      </div>

      {/* Distress Level Waveform Spline Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-[16px] text-primary font-headline">
              Distress Level Waveform
            </h3>
            <span className="text-[12px] text-on-surface-variant">
              7-day biometric & cognitive distress variance
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-secondary rounded" />
              <span>Distress</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-outline-variant border-b border-dashed" />
              <span>Baseline Norm</span>
            </div>
          </div>
        </div>

        {/* SVG Spline Chart */}
        <div className="relative pt-3 pb-2">
          <svg className="w-full h-44 overflow-visible" viewBox="0 0 350 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="distressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#36314e" stopOpacity="0.30" />
                <stop offset="60%" stopColor="#5e5b7a" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#5e5b7a" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Baseline norm corridor */}
            <rect x="0" y="65" width="350" height="40" fill="#eeedf0" fillOpacity="0.6" rx="4" />
            <line x1="0" y1="85" x2="350" y2="85" stroke="#79767e" strokeDasharray="3 3" strokeWidth="1" />

            {/* Spline Area Fill */}
            <path
              d="M 25,98 Q 75,90 125,82 T 175,25 T 225,55 T 275,72 T 325,80 L 325,130 L 25,130 Z"
              fill="url(#distressGradient)"
            />

            {/* Smooth Spline Stroke */}
            <path
              d="M 25,98 Q 75,90 125,82 T 175,25 T 225,55 T 275,72 T 325,80"
              fill="none"
              stroke="#36314e"
              strokeWidth="3"
            />

            {/* Interactive Points */}
            {[
              { cx: 25, cy: 98, i: 0 },
              { cx: 75, cy: 90, i: 1 },
              { cx: 125, cy: 82, i: 2 },
              { cx: 175, cy: 25, i: 3, isSpike: true },
              { cx: 225, cy: 55, i: 4 },
              { cx: 275, cy: 72, i: 5 },
              { cx: 325, cy: 80, i: 6, isCurrent: true },
            ].map((pt) => {
              const isSelected = activePointIndex === pt.i;
              return (
                <g key={pt.i} className="cursor-pointer" onClick={() => setActivePointIndex(pt.i)}>
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r={isSelected ? 6 : 4}
                    fill={pt.isSpike ? '#6d003c' : pt.isCurrent ? '#36314e' : '#5e5b7a'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all"
                  />
                  {pt.isSpike && (
                    <text
                      x={pt.cx}
                      y={pt.cy - 10}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-[#6d003c]"
                    >
                      Spike
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* X Axis labels */}
          <div className="flex justify-between px-2 text-[11px] text-on-surface-variant font-medium pt-2">
            {dataPoints.map((dp, i) => (
              <button
                key={dp.day}
                onClick={() => setActivePointIndex(i)}
                className={`transition-colors cursor-pointer ${
                  activePointIndex === i ? 'text-primary font-bold' : 'hover:text-primary'
                }`}
              >
                {dp.day}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Point Callout */}
        {activePointIndex !== null && (
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between text-[12px]">
            <div>
              <strong className="text-primary">{dataPoints[activePointIndex].day}:</strong>{' '}
              <span className="text-on-surface">{dataPoints[activePointIndex].note}</span>
            </div>
            <span className="font-bold text-primary font-headline">
              {dataPoints[activePointIndex].val}/100
            </span>
          </div>
        )}
      </div>

      {/* Identified Stress Drivers Breakdown */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
        <h3 className="font-bold text-[16px] text-primary font-headline">
          Identified Stress Drivers
        </h3>

        <div className="flex flex-col gap-3.5">
          {[
            { label: 'Court Preparation & Case Review', pct: 48, color: 'bg-primary' },
            { label: 'Sleep Fragmentation & Restlessness', pct: 24, color: 'bg-secondary' },
            { label: 'Interpersonal Case Discussions', pct: 18, color: 'bg-primary-container' },
            { label: 'General Environmental Fatigue', pct: 10, color: 'bg-secondary-fixed-dim' },
          ].map((driver) => (
            <div key={driver.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[12.5px]">
                <span className="text-on-surface font-medium">{driver.label}</span>
                <span className="font-bold text-primary">{driver.pct}%</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div
                  className={`${driver.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${driver.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Longitudinal Intervention Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-secondary uppercase">
            Distress Attenuation
          </span>
          <div className="text-2xl font-bold text-primary font-headline">-32%</div>
          <span className="text-[11px] text-on-surface-variant">
            Average distress reduction after 4-7-8 breathing cycles.
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-secondary uppercase">
            Breathwork Completed
          </span>
          <div className="text-2xl font-bold text-primary font-headline">8 Sessions</div>
          <span className="text-[11px] text-on-surface-variant">
            Regulated parasympathetic activation across 7 days.
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-secondary uppercase">
            Companion Engagement
          </span>
          <div className="text-2xl font-bold text-primary font-headline">14 min</div>
          <span className="text-[11px] text-on-surface-variant">
            Mean reflective dialogue length per debrief.
          </span>
        </div>
      </div>

      {/* Serene Architectural Wellness Space Photo */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs border border-surface-container group">
        <img
          src={ASSETS.wellnessSpace}
          alt="Serene architectural wellness space"
          className="w-full h-44 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-103"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
          <span className="text-[11px] font-semibold text-secondary-container tracking-wider uppercase">
            Cognitive Restoration
          </span>
          <h4 className="text-base font-bold font-headline mt-0.5">
            Architecture of Calm
          </h4>
          <p className="text-[12px] text-white/90 leading-snug max-w-md">
            Visual exposure to unhurried, natural spatial structures correlates with an immediate 19% stabilization in autonomic response.
          </p>
        </div>
      </div>

      {/* Export Clinical Summary Card */}
      <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <h4 className="font-bold text-[15px] text-primary font-headline">
              Export Clinical Summary (PDF)
            </h4>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-relaxed max-w-md">
            Exports are cryptographically sanitized to remove personal identifiable testimony while preserving clinical distress indices for your healthcare provider.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-[13px] shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer shrink-0"
          type="button"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </>
          )}
        </button>
      </div>

      {exportSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 text-[13px] font-semibold flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          Clinical summary downloaded: DYNA-MIND-Report-ElenaVance-Nov.pdf
        </div>
      )}
    </div>
  );
};
