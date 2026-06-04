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
      <p className="text-sm font-bold text-brand-purple">
        {val ? `${Math.round(val)}%` : '--'}
      </p>
    </div>
  );
};

export default function SpO2Chart({ data = [], compact = false }) {
  const chartData = data.map((r) => ({
    time: formatChartTime(r.timestamp),
    spo2: r.spo2 > 0 ? r.spo2 : null,
  }));

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="metric-label">Blood Oxygen (SpO2)</p>
          <p className="text-xs text-txt-secondary mt-0.5">Oxygen saturation %</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={compact ? 140 : 180}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
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
            domain={[85, 100]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.7} />
          <ReferenceLine y={94} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
          <Area
            type="monotoneX"
            dataKey="spo2"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#spo2Grad)"
            dot={false}
            activeDot={{ r: 4, fill: '#8b5cf6', stroke: '#0f172a', strokeWidth: 2 }}
            connectNulls={false}
            isAnimationActive={true}
            animationDuration={400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
