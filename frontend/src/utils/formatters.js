export const formatTimestamp = (date) => {
  if (!date) return 'Never';
  const d = new Date(date);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);

  if (diff < 5)   return 'Just now';
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const formatFullTime = (date) => {
  if (!date) return '--';
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatTime = (date) => {
  if (!date) return '--';
  return new Date(date).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatChartTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatBPM = (value) => {
  if (!value || value === 0) return '--';
  return `${Math.round(value)}`;
};

export const formatSpO2 = (value) => {
  if (!value || value === 0) return '--';
  return `${Math.round(value)}`;
};

export const formatTemp = (value) => {
  if (!value || value === 0) return '--.-';
  return value.toFixed(1);
};

export const formatAccel = (value) => {
  if (!value || value === 0) return '--';
  return value.toFixed(2);
};

export const formatUptime = (seconds) => {
  if (!seconds || seconds <= 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

export const getAlertTypeLabel = (type) => {
  const labels = {
    fall:       '🚨 Fall Detected',
    low_hr:     '💔 Low Heart Rate',
    high_hr:    '❤️‍🔥 High Heart Rate',
    low_spo2:   '🫁 Low SpO2',
    high_temp:  '🌡️ Fever',
    low_temp:   '🥶 Low Temperature',
    inactivity: '😴 Inactivity',
    general:    '⚠️ Health Alert',
  };
  return labels[type] || '⚠️ Alert';
};

export const getAlertTypeColor = (type) => {
  const colors = {
    fall:       'text-red-400 border-red-500/40 bg-red-500/10',
    low_hr:     'text-purple-400 border-purple-500/40 bg-purple-500/10',
    high_hr:    'text-orange-400 border-orange-500/40 bg-orange-500/10',
    low_spo2:   'text-blue-400 border-blue-500/40 bg-blue-500/10',
    high_temp:  'text-amber-400 border-amber-500/40 bg-amber-500/10',
    low_temp:   'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    inactivity: 'text-slate-400 border-slate-500/40 bg-slate-500/10',
    general:    'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
  };
  return colors[type] || colors.general;
};
