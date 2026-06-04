import { AlertTriangle, X } from 'lucide-react';
import { getAlertTypeLabel, formatTimestamp } from '../utils/formatters';

export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null;

  return (
    <div className="animate-fade-in relative rounded-xl border border-red-500/60 
                    bg-red-500/10 overflow-hidden">
      {/* Flashing top bar */}
      <div className="h-1 w-full bg-red-500 animate-flash" />

      <div className="flex items-start gap-4 px-5 py-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40
                        flex items-center justify-center animate-pulse-slow">
          <AlertTriangle size={20} className="text-red-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-red-400">
              {getAlertTypeLabel(alert.type)}
            </span>
            <span className="badge badge-danger">ACTIVE</span>
            <span className="text-xs text-txt-secondary">
              {formatTimestamp(alert.timestamp)}
            </span>
          </div>
          <p className="text-sm text-red-200 mt-1">{alert.reason}</p>

          {/* Sensor values at alert time */}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {alert.heartRate > 0 && (
              <span className="text-xs text-txt-secondary">
                HR: <span className="text-txt-primary font-mono">{Math.round(alert.heartRate)} BPM</span>
              </span>
            )}
            {alert.spo2 > 0 && (
              <span className="text-xs text-txt-secondary">
                SpO2: <span className="text-txt-primary font-mono">{Math.round(alert.spo2)}%</span>
              </span>
            )}
            {alert.temperature > 0 && (
              <span className="text-xs text-txt-secondary">
                Temp: <span className="text-txt-primary font-mono">{alert.temperature.toFixed(1)}°C</span>
              </span>
            )}
            {alert.healthScore > 0 && (
              <span className="text-xs text-txt-secondary">
                Score: <span className="text-txt-primary font-mono">{alert.healthScore}/100</span>
              </span>
            )}
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(alert._id)}
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30
                     flex items-center justify-center text-red-400 hover:bg-red-500/30
                     transition-colors duration-150"
          title="Dismiss alert"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
