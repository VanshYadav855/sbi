import { useState } from 'react';
import { formatCurrency } from '../utils/format';

export default function ForecastBarChart({
  weeklyForecast = [],
  surplusWeek,
  cashGapRisk,
  height = 200,
  showLabels = false,
  suppressed = false,
}) {
  const [tooltip, setTooltip] = useState(null);
  const barCount = weeklyForecast.length || 8;
  const maxVal = Math.max(...weeklyForecast, 1);
  const avg = weeklyForecast.reduce((a, b) => a + b, 0) / (weeklyForecast.length || 1);
  const avgPct = (avg / maxVal) * 100;

  function getBarColor(index, weekNum) {
    if (suppressed) return 'bg-muted/50';
    if (surplusWeek === weekNum) return 'bg-saffron';
    if (cashGapRisk === 'High' && index >= barCount - 3) return 'bg-danger/60';
    return 'bg-teal/60';
  }

  return (
    <div className="w-full">
      <div
        className={`relative w-full rounded-lg ${showLabels ? 'bg-elevated/30 border border-border/50 p-3' : ''}`}
        style={{ height: `${height}px` }}
      >
        {showLabels && (
          <>
            <span className="absolute left-0 top-3 text-[10px] text-teal/70 font-mono z-10">
              {formatCurrency(maxVal)}
            </span>
            <span className="absolute left-0 bottom-3 text-[10px] text-muted font-mono z-10">₹0</span>
            <div
              className="absolute left-8 right-1 border-t border-dashed border-teal/30 z-10 pointer-events-none"
              style={{ bottom: `${avgPct}%` }}
            >
              <span className="text-[9px] text-teal font-mono ml-1 bg-surface/90 px-1.5 py-0.5 rounded border border-teal/20">
                avg {formatCurrency(Math.round(avg))}
              </span>
            </div>
          </>
        )}

        <div
          className={`relative w-full h-full flex items-end gap-1 ${showLabels ? 'ml-8 mr-1' : ''} ${
            suppressed ? 'opacity-50' : ''
          }`}
        >
          {weeklyForecast.map((weekValue, i) => {
            const weekNum = i + 1;
            const heightPercent = (weekValue / maxVal) * 100;
            const isSurplus = surplusWeek === weekNum;

            return (
              <div
                key={weekNum}
                className="relative flex-1 flex flex-col items-center justify-end h-full"
                onMouseEnter={() => setTooltip(weekNum)}
                onMouseLeave={() => setTooltip(null)}
              >
                {isSurplus && (
                  <span className="text-[9px] font-mono font-medium text-saffron whitespace-nowrap mb-1 bg-saffron/10 px-1.5 py-0.5 rounded border border-saffron/30">
                    ▲ Peak
                  </span>
                )}
                <div
                  className={`w-full rounded-t-sm transition-opacity hover:opacity-90 ${getBarColor(i, weekNum)} ${
                    isSurplus ? 'ring-1 ring-saffron/50' : ''
                  }`}
                  style={{
                    height: `${heightPercent}%`,
                    minHeight: '4px',
                  }}
                />
                {tooltip === weekNum && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 px-2 py-1 rounded bg-elevated border border-border text-[10px] font-mono text-text-primary whitespace-nowrap shadow-lg pointer-events-none">
                    Week {weekNum} · {formatCurrency(weekValue)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {suppressed && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/40 backdrop-blur-[1px] z-30">
            <span className="text-xs text-muted bg-surface/95 px-4 py-1.5 rounded-full border border-border shadow-lg">
              ◉ Monitoring only — insufficient signals
            </span>
          </div>
        )}
      </div>

      {showLabels && (
        <div className={`flex mt-2 ${showLabels ? 'ml-8 mr-1' : ''}`}>
          {weeklyForecast.map((_, i) => (
            <span
              key={i}
              className={`text-center text-[9px] font-mono flex-1 ${
                surplusWeek === i + 1 ? 'text-saffron font-medium' : 'text-muted'
              }`}
            >
              Wk{i + 1}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
