import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { formatChartTime } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bg-bg-secondary border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-txt-secondary mb-1">{label}</p>
      <p className="text-sm font-bold text-brand-cyan">
        {val ? `${Math.round(val)} BPM` : '--'}
      </p>
    </div>
  );
};

export default function HeartRateChart({ data = [], compact = false }) {
  const chartData = data.map((r) => ({
    time:      formatChartTime(r.timestamp),
    heartRate: r.heartRate > 0 ? r.heartRate : null,
  }));

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="metric-label">Heart Rate</p>
          <p className="text-xs text-txt-secondary mt-0.5">Beats per minute (BPM)</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-txt-secondary">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-red-500 inline-block" style={{ borderTop: '1px dashed #ef4444' }} />
            Danger zone
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-brand-cyan inline-block" />
            HR
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={compact ? 140 : 180}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[40, 150]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={50}  stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.7} />
          <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.7} />
          <Area
            type="monotoneX"
            dataKey="heartRate"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#hrGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 2 }}
            connectNulls={false}
            isAnimationActive={true}
            animationDuration={400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
