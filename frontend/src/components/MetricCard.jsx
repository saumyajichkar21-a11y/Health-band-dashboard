import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { STATUS_COLORS } from '../utils/healthScore';

export default function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  status = 'normal',
  previousValue,
  subtitle,
  iconColor,
}) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.normal;

  const getTrend = () => {
    if (previousValue === undefined || previousValue === null) return null;
    if (value === 0 || previousValue === 0) return null;
    const diff = value - previousValue;
    if (Math.abs(diff) < 0.5) return { icon: Minus, color: 'text-txt-secondary', label: 'Stable' };
    if (diff > 0) return { icon: TrendingUp, color: 'text-amber-400', label: `+${diff.toFixed(1)}` };
    return { icon: TrendingDown, color: 'text-cyan-400', label: diff.toFixed(1) };
  };

  const trend = getTrend();

  return (
    <div
      className={`card border-l-2 ${colors.border} ${colors.bg} 
                  transition-all duration-300 hover:scale-[1.01] animate-fade-in`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="metric-label">{title}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${colors.bg} border ${colors.border} 
                          flex items-center justify-center`}>
            <Icon size={16} className={iconColor || colors.text} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold tabular-nums ${colors.text}`}>
          {value === 0 || value === null || value === undefined ? '--' : value}
        </span>
        {unit && (
          <span className="text-sm text-txt-secondary mb-1 font-medium">{unit}</span>
        )}
      </div>

      {/* Trend + subtitle */}
      <div className="flex items-center justify-between mt-2">
        {subtitle && (
          <span className="text-xs text-txt-secondary">{subtitle}</span>
        )}
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend.color} ml-auto`}>
            <trend.icon size={12} />
            <span>{trend.label}</span>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="mt-3 h-0.5 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full ${
            status === 'danger' ? 'bg-red-500' :
            status === 'warning' ? 'bg-amber-500' : 'bg-green-500'
          }`}
          style={{ width: status === 'danger' ? '100%' : status === 'warning' ? '60%' : '30%' }}
        />
      </div>
    </div>
  );
}
