import ForecastBarChart from './ForecastBarChart';

export default function MirrorMindForecastChart({
  mirrorMind,
  height = 200,
  showLabels = false,
  suppressed = false,
  peakLabelPrefix: _peakLabelPrefix,
}) {
  const { weeklyForecast = [], surplusWeek, cashGapRisk } = mirrorMind || {};

  return (
    <ForecastBarChart
      weeklyForecast={weeklyForecast}
      surplusWeek={surplusWeek}
      cashGapRisk={cashGapRisk}
      height={height}
      showLabels={showLabels}
      suppressed={suppressed}
    />
  );
}

export { isDownwardTrend } from './mirrorMindChartUtils';
