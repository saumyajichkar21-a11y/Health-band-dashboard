import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { formatChartTime } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bg-bg-secondary border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-txt-secondary mb-1">{label}</p>
      <p className="text-sm font-bold text-amber-400">
        {val ? `${val.toFixed(1)}°C` : '--'}
      </p>
    </div>
  );
};

export default function TemperatureChart({ data = [], compact = false }) {
  const chartData = data.map((r) => ({
    time: formatChartTime(r.timestamp),
    temp: r.temperature > 0 ? parseFloat(r.temperature.toFixed(1)) : null,
  }));

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="metric-label">Body Temperature</p>
          <p className="text-xs text-txt-secondary mt-0.5">Degrees Celsius (°C)</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={compact ? 140 : 180}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[34, 40]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={38}   stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.7} />
          <ReferenceLine y={35}   stroke="#06b6d4" strokeDasharray="4 4" strokeOpacity={0.7} />
          <ReferenceLine y={36.5} stroke="#22c55e" strokeDasharray="2 4" strokeOpacity={0.5} />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#f59e0b', stroke: '#0f172a', strokeWidth: 2 }}
            connectNulls={false}
            isAnimationActive={true}
            animationDuration={400}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
