import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { getScoreColor, getScoreLabel } from '../utils/healthScore';

export default function HealthScoreGauge({ score = 100 }) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const data = [
    { name: 'bg',    value: 100, fill: '#1e293b' },
    { name: 'score', value: score, fill: color },
  ];

  return (
    <div className="card flex flex-col items-center justify-center h-full min-h-[200px]">
      <p className="metric-label mb-3">Health Score</p>

      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="65%"
            outerRadius="90%"
            startAngle={225}
            endAngle={-45}
            barSize={10}
            data={data}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              background={{ fill: '#0f172a' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-xs text-txt-secondary mt-0.5">/ 100</span>
        </div>
      </div>

      <span
        className="mt-2 text-sm font-semibold"
        style={{ color }}
      >
        {label}
      </span>

      {/* Scale labels */}
      <div className="flex justify-between w-40 mt-1 px-1">
        <span className="text-xs text-txt-muted">0</span>
        <span className="text-xs text-txt-muted">100</span>
      </div>
    </div>
  );
}
