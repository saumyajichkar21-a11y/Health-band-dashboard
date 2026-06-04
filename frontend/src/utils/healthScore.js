export const computeHealthScore = (heartRate, spo2, temperature) => {
  let score = 100;

  if (heartRate > 0) {
    if (heartRate < 50)       score -= 30;
    else if (heartRate < 60)  score -= 10;
    else if (heartRate > 120) score -= 25;
    else if (heartRate > 100) score -= 10;
  }

  if (spo2 > 0) {
    if (spo2 < 90)      score -= 40;
    else if (spo2 < 94) score -= 20;
    else if (spo2 < 96) score -= 10;
  }

  if (temperature > 0) {
    if (temperature > 39.5)     score -= 20;
    else if (temperature > 38)  score -= 10;
    else if (temperature < 35)  score -= 15;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

export const getScoreStatus = (score) => {
  if (score >= 80) return 'normal';
  if (score >= 50) return 'warning';
  return 'danger';
};

export const getScoreColor = (score) => {
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

export const getScoreLabel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 65) return 'Fair';
  if (score >= 50) return 'Poor';
  return 'Critical';
};

export const getHRStatus = (hr) => {
  if (hr <= 0)   return 'normal';
  if (hr < 50)   return 'danger';
  if (hr > 120)  return 'danger';
  if (hr < 60 || hr > 100) return 'warning';
  return 'normal';
};

export const getSpO2Status = (spo2) => {
  if (spo2 <= 0) return 'normal';
  if (spo2 < 90) return 'danger';
  if (spo2 < 94) return 'warning';
  return 'normal';
};

export const getTempStatus = (temp) => {
  if (temp <= 0)   return 'normal';
  if (temp > 39.5) return 'danger';
  if (temp > 38)   return 'warning';
  if (temp < 35)   return 'danger';
  return 'normal';
};

export const getAccelStatus = (mag) => {
  if (mag > 25) return 'danger';
  if (mag > 15) return 'warning';
  return 'normal';
};

export const STATUS_COLORS = {
  normal:  { border: 'border-green-500/40',  text: 'text-green-400',  bg: 'bg-green-500/10',  hex: '#22c55e' },
  warning: { border: 'border-amber-500/40',  text: 'text-amber-400',  bg: 'bg-amber-500/10',  hex: '#f59e0b' },
  danger:  { border: 'border-red-500/40',    text: 'text-red-400',    bg: 'bg-red-500/10',    hex: '#ef4444' },
};
