export function isDownwardTrend(weeklyForecast, cashGapRisk) {
  if (cashGapRisk === 'High') return true;
  if (!weeklyForecast?.length) return false;
  const firstHalf = weeklyForecast.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
  const secondHalf = weeklyForecast.slice(4).reduce((a, b) => a + b, 0) / 4;
  return secondHalf < firstHalf * 0.85;
}
