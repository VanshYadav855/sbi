import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getConfidenceColor } from '../../utils/format';

function getScoreColor(score) {
  if (score >= 90) return '#F97316';
  if (score >= 75) return '#0EA5E9';
  if (score >= 60) return '#F59E0B';
  return '#EF4444';
}

const TOOLTIP_TEXT =
  'JeevanScore fuses life event signals (salary hike, EMI freed, harvest) with local economic data (MSP rates, festival season, crop calendar) to calculate when a customer is most likely to need a product.';

export default function JeevanScoreGauge({ score, confidence, size = 60 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const strokeWidth = size <= 60 ? 5 : size <= 80 ? 6 : 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const progress = (animatedScore / 100) * arcLength;
  const color = getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 50);
    return () => clearTimeout(timer);
  }, [score]);

  const fontSize = size <= 60 ? 'text-lg' : size <= 80 ? 'text-2xl' : 'text-4xl';
  const subSize = size <= 60 ? 'text-[8px]' : size <= 80 ? 'text-[10px]' : 'text-xs';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-[135deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: arcLength - progress }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-medium ${fontSize} text-text-primary leading-none`}>
            {score}
          </span>
          <span className={`font-mono ${subSize} text-muted`}>/ 100</span>
        </div>
      </div>
      {confidence && (
        <span
          className={`mt-1.5 text-[10px] font-body font-medium px-2 py-0.5 rounded border ${getConfidenceColor(confidence)}`}
        >
          {confidence}
        </span>
      )}
      <div className="relative mt-1">
        <button
          type="button"
          className="text-[10px] text-muted hover:text-teal transition-colors cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          aria-label="What is JeevanScore?"
        >
          ⓘ
        </button>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 px-3 py-2 rounded-lg bg-elevated border border-border text-[10px] text-muted leading-relaxed shadow-xl z-50 pointer-events-none">
            {TOOLTIP_TEXT}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-elevated" />
          </div>
        )}
      </div>
    </div>
  );
}
