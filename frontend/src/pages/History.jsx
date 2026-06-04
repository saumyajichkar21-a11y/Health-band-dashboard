import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import HeartRateChart   from '../components/HeartRateChart';
import SpO2Chart        from '../components/SpO2Chart';
import TemperatureChart from '../components/TemperatureChart';

const RANGES = [
  { label: '1 Hour',  value: '1h' },
  { label: '6 Hours', value: '6h' },
  { label: '24 Hours',value: '24h' },
  { label: '7 Days',  value: '7d' },
];

function StatBox({ label, min, max, avg, unit, color }) {
  return (
    <div className="card-sm flex-1 min-w-0">
      <p className="text-xs text-txt-secondary mb-2">{label}</p>
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-xs text-txt-secondary">
            <TrendingDown size={11} className="text-cyan-400" /> Min
          </span>
          <span className="text-xs font-mono font-semibold text-txt-primary">
            {min !== undefined && !isNaN(min) && isFinite(min) ? `${min}${unit}` : '--'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-xs text-txt-secondary">
            <Minus size={11} className="text-amber-400" /> Avg
          </span>
          <span className={`text-xs font-mono font-bold ${color}`}>
            {avg !== undefined && !isNaN(avg) ? `${avg}${unit}` : '--'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-xs text-txt-secondary">
            <TrendingUp size={11} className="text-red-400" /> Max
          </span>
          <span className="text-xs font-mono font-semibold text-txt-primary">
            {max !== undefined && !isNaN(max) && isFinite(max) ? `${max}${unit}` : '--'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const [range, setRange]     = useState('1h');
  const [data, setData]       = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount]     = useState(0);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/readings/history?range=${range}`)
      .then(r => {
        setData(r.data.data   || []);
        setStats(r.data.stats || null);
        setCount(r.data.count || 0);
      })
      .catch(err => console.error('[History] fetch error:', err.message))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart2 size={18} className="text-brand-cyan" />
          <div>
            <p className="text-sm font-semibold text-txt-primary">Historical Readings</p>
            <p className="text-xs text-txt-secondary">
              {loading ? 'Loading...' : `${count} readings in selected range`}
            </p>
          </div>
        </div>

        {/* Range selector */}
        <div className="flex items-center gap-1 bg-bg-secondary border border-border rounded-lg p-1">
          {RANGES.map(r => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150
                ${range === r.value
                  ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                  : 'text-txt-secondary hover:text-txt-primary hover:bg-bg-hover'
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="card">
            <p className="metric-label mb-3">Heart Rate Summary</p>
            <div className="flex gap-3">
              <StatBox
                label="BPM"
                min={stats.heartRate?.min}
                max={stats.heartRate?.max}
                avg={stats.heartRate?.avg}
                unit=" BPM"
                color="text-brand-cyan"
              />
            </div>
          </div>
          <div className="card">
            <p className="metric-label mb-3">SpO2 Summary</p>
            <div className="flex gap-3">
              <StatBox
                label="%"
                min={stats.spo2?.min}
                max={stats.spo2?.max}
                avg={stats.spo2?.avg}
                unit="%"
                color="text-brand-purple"
              />
            </div>
          </div>
          <div className="card">
            <p className="metric-label mb-3">Temperature Summary</p>
            <div className="flex gap-3">
              <StatBox
                label="°C"
                min={stats.temperature?.min}
                max={stats.temperature?.max}
                avg={stats.temperature?.avg}
                unit="°C"
                color="text-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-cyan/30 border-t-brand-cyan animate-spin" />
            <p className="text-sm text-txt-secondary">Loading readings...</p>
          </div>
        </div>
      )}

      {/* No data */}
      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-txt-secondary">
          <BarChart2 size={36} className="mb-3 opacity-30" />
          <p className="text-sm">No readings found for this time range</p>
          <p className="text-xs mt-1 opacity-60">Make sure the device is sending data</p>
        </div>
      )}

      {/* Charts */}
      {!loading && data.length > 0 && (
        <div className="space-y-4">
          <div className="h-72">
            <HeartRateChart data={data} />
          </div>
          <div className="h-72">
            <SpO2Chart data={data} />
          </div>
          <div className="h-72">
            <TemperatureChart data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
