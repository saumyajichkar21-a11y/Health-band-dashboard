import { X, CheckCircle } from 'lucide-react';
import { getAlertTypeLabel, getAlertTypeColor, formatTimestamp } from '../utils/formatters';

function AlertItem({ alert, onDismiss, compact }) {
  const colorClass = getAlertTypeColor(alert.type);
  const isActive   = alert.status === 'active';

  return (
    <div className={`rounded-lg border p-3 transition-all duration-200 animate-fade-in ${colorClass}
                    ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold">
              {getAlertTypeLabel(alert.type)}
            </span>
            {isActive
              ? <span className="badge badge-danger text-[10px] py-0 animate-pulse">ACTIVE</span>
              : <span className="badge badge-gray   text-[10px] py-0">Dismissed</span>
            }
            <span className="text-xs opacity-60 ml-auto">
              {formatTimestamp(alert.timestamp)}
            </span>
          </div>

          <p className="text-xs opacity-80 mt-1 leading-relaxed">{alert.reason}</p>

          {!compact && (
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {alert.heartRate > 0 && (
                <span className="text-xs opacity-60">
                  HR: <span className="font-mono opacity-90">{Math.round(alert.heartRate)}</span>
                </span>
              )}
              {alert.spo2 > 0 && (
                <span className="text-xs opacity-60">
                  SpO2: <span className="font-mono opacity-90">{Math.round(alert.spo2)}%</span>
                </span>
              )}
              {alert.temperature > 0 && (
                <span className="text-xs opacity-60">
                  Temp: <span className="font-mono opacity-90">{alert.temperature.toFixed(1)}°C</span>
                </span>
              )}
            </div>
          )}
        </div>

        {isActive && onDismiss && (
          <button
            onClick={() => onDismiss(alert._id)}
            className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center
                       bg-white/10 hover:bg-white/20 transition-colors duration-150"
            title="Dismiss"
          >
            <X size={12} />
          </button>
        )}
        {!isActive && (
          <CheckCircle size={14} className="flex-shrink-0 opacity-40 mt-0.5" />
        )}
      </div>
    </div>
  );
}

export default function AlertFeed({
  alerts = [],
  onDismiss,
  compact = false,
  maxItems,
  emptyMessage = 'No alerts',
}) {
  const displayed = maxItems ? alerts.slice(0, maxItems) : alerts;

  if (displayed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-txt-secondary">
        <CheckCircle size={28} className="text-green-500 mb-2 opacity-60" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayed.map((alert) => (
        <AlertItem
          key={alert._id}
          alert={alert}
          onDismiss={onDismiss}
          compact={compact}
        />
      ))}
    </div>
  );
}
