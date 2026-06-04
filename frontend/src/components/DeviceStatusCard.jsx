import { Wifi, WifiOff, Battery, Cpu, Thermometer, Activity } from 'lucide-react';
import { formatTimestamp } from '../utils/formatters';

export default function DeviceStatusCard({ deviceStatus, compact = false }) {
  if (!deviceStatus) {
    return (
      <div className="card flex items-center justify-center h-full min-h-[120px]">
        <p className="text-sm text-txt-secondary">Loading device status...</p>
      </div>
    );
  }

  const { isOnline, lastSeen, secondsSinceLastSeen, sensors, batteryLevel, totalReadings } = deviceStatus;

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="metric-label">Device Status</span>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border
                        ${isOnline
                          ? 'bg-green-500/15 text-green-400 border-green-500/30'
                          : 'bg-red-500/15 text-red-400 border-red-500/30'}`}>
          {isOnline
            ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Online</>
            : <><WifiOff size={11} />Offline</>
          }
        </div>
      </div>

      <div className="space-y-2.5">
        {/* WiFi */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-txt-secondary">
            <Wifi size={13} />
            <span>WiFi</span>
          </div>
          <span className={`text-xs font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {isOnline ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Last seen */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-txt-secondary">
            <Activity size={13} />
            <span>Last seen</span>
          </div>
          <span className={`text-xs font-medium ${
            secondsSinceLastSeen !== null && secondsSinceLastSeen < 30
              ? 'text-green-400'
              : secondsSinceLastSeen !== null && secondsSinceLastSeen < 60
              ? 'text-amber-400'
              : 'text-red-400'
          }`}>
            {lastSeen ? formatTimestamp(lastSeen) : 'Never'}
          </span>
        </div>

        {/* Battery */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-txt-secondary">
            <Battery size={13} />
            <span>Battery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 bg-bg-primary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  batteryLevel > 50 ? 'bg-green-500' :
                  batteryLevel > 20 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
            <span className={`text-xs font-medium ${
              batteryLevel > 50 ? 'text-green-400' :
              batteryLevel > 20 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {batteryLevel}%
            </span>
          </div>
        </div>

        {!compact && (
          <>
            {/* Sensor rows */}
            {sensors && Object.entries(sensors).map(([sensor, status]) => (
              <div key={sensor} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-txt-secondary">
                  <Cpu size={13} />
                  <span>{sensor}</span>
                </div>
                <span className={`text-xs font-medium ${
                  status === 'OK' ? 'text-green-400' : 'text-amber-400'
                }`}>
                  {status}
                </span>
              </div>
            ))}

            {/* Total readings */}
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="text-xs text-txt-secondary">Total Readings</span>
              <span className="text-xs font-mono text-txt-primary">{totalReadings?.toLocaleString() ?? '--'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-txt-secondary">Patient ID</span>
              <span className="text-xs font-mono text-brand-cyan">GRP05-001</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
