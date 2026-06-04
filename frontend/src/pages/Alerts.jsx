import { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Activity, XCircle } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts.jsx';
import AlertFeed from '../components/AlertFeed';

const FILTERS = [
  { label: 'All',        value: 'all' },
  { label: 'Active',     value: 'active' },
  { label: 'Dismissed',  value: 'dismissed' },
  { label: 'Fall',       value: 'fall' },
  { label: 'Vital Signs',value: 'vitals' },
  { label: 'Inactivity', value: 'inactivity' },
];

const VITALS_TYPES = ['low_hr', 'high_hr', 'low_spo2', 'high_temp', 'low_temp'];

function CountCard({ label, value, icon: Icon, color, bgColor, borderColor }) {
  return (
    <div className={`card border ${borderColor} ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-txt-secondary mb-1">{label}</p>
          <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
        </div>
        <Icon size={22} className={`${color} opacity-60`} />
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const { alerts, counts, loading, dismissAlert, dismissAll } = useAlerts();
  const [filter, setFilter] = useState('all');
  const [showConfirm, setShowConfirm] = useState(false);

  const filtered = alerts.filter(a => {
    if (filter === 'all')        return true;
    if (filter === 'active')     return a.status === 'active';
    if (filter === 'dismissed')  return a.status === 'dismissed';
    if (filter === 'fall')       return a.type === 'fall';
    if (filter === 'vitals')     return VITALS_TYPES.includes(a.type);
    if (filter === 'inactivity') return a.type === 'inactivity';
    return true;
  });

  const handleDismissAll = async () => {
    await dismissAll();
    setShowConfirm(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <CountCard
          label="Total Alerts"
          value={counts.total}
          icon={Bell}
          color="text-txt-primary"
          bgColor="bg-transparent"
          borderColor="border-border"
        />
        <CountCard
          label="Active"
          value={counts.active}
          icon={AlertTriangle}
          color="text-red-400"
          bgColor="bg-red-500/5"
          borderColor="border-red-500/20"
        />
        <CountCard
          label="Falls Detected"
          value={counts.fall}
          icon={Activity}
          color="text-amber-400"
          bgColor="bg-amber-500/5"
          borderColor="border-amber-500/20"
        />
        <CountCard
          label="Dismissed"
          value={counts.dismissed}
          icon={CheckCircle}
          color="text-green-400"
          bgColor="bg-green-500/5"
          borderColor="border-green-500/20"
        />
      </div>

      {/* Filter + dismiss-all row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border
                ${filter === f.value
                  ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30'
                  : 'text-txt-secondary border-border hover:text-txt-primary hover:bg-bg-hover'
                }`}
            >
              {f.label}
              {f.value === 'active' && counts.active > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold
                                 rounded-full px-1.5 py-0.5">
                  {counts.active}
                </span>
              )}
            </button>
          ))}
        </div>

        {counts.active > 0 && (
          <div className="relative">
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-txt-secondary">Dismiss all active?</span>
                <button
                  onClick={handleDismissAll}
                  className="btn-danger text-xs"
                >
                  Yes, dismiss all
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="btn-ghost text-xs flex items-center gap-1.5"
              >
                <XCircle size={13} />
                Dismiss All Active
              </button>
            )}
          </div>
        )}
      </div>

      {/* Alert count for current filter */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-txt-secondary">
          Showing <span className="text-txt-primary font-medium">{filtered.length}</span> alerts
        </p>
      </div>

      {/* Alert feed */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 rounded-full border-2 border-brand-cyan/30 border-t-brand-cyan animate-spin" />
          </div>
        ) : (
          <AlertFeed
            alerts={filtered}
            onDismiss={dismissAlert}
            compact={false}
            emptyMessage={
              filter === 'active'
                ? 'No active alerts — patient is stable'
                : 'No alerts found for this filter'
            }
          />
        )}
      </div>
    </div>
  );
}
