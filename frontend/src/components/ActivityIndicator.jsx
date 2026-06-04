import { Activity } from 'lucide-react';

export default function ActivityIndicator({ accelMag = 0 }) {
  const getStatus = (mag) => {
    if (mag > 25) return { label: 'Fall Detected!', color: 'bg-red-500',   text: 'text-red-400',   pct: 100 };
    if (mag > 15) return { label: 'High Activity',  color: 'bg-amber-500', text: 'text-amber-400', pct: 70 };
    if (mag > 11) return { label: 'Active',         color: 'bg-green-500', text: 'text-green-400', pct: 45 };
    if (mag > 0)  return { label: 'Resting',        color: 'bg-cyan-500',  text: 'text-cyan-400',  pct: 20 };
    return         { label: 'No Data',             color: 'bg-slate-600', text: 'text-txt-secondary', pct: 0 };
  };

  const st = getStatus(accelMag);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="metric-label">Activity Level</span>
        <Activity size={15} className={st.text} />
      </div>

      {/* Bar */}
      <div className="h-2.5 bg-bg-primary rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${st.color}`}
          style={{ width: `${st.pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
        <span className="text-xs font-mono text-txt-secondary">
          {accelMag > 0 ? `${accelMag.toFixed(2)} m/s²` : '--'}
        </span>
      </div>

      {/* Scale */}
      <div className="flex justify-between mt-1">
        <span className="text-xs text-txt-muted">Rest</span>
        <span className="text-xs text-txt-muted">Active</span>
        <span className="text-xs text-red-500">Fall</span>
      </div>
    </div>
  );
}
