import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Wifi, WifiOff, Cpu, Thermometer, Activity,
  Heart, Battery, RefreshCw, Clock,
} from 'lucide-react';
import { formatTimestamp, formatFullTime } from '../utils/formatters';
import { useLiveData } from '../hooks/useLiveData';

function SensorRow({ name, status, icon: Icon }) {
  const ok = status === 'OK';
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border
                        ${ok ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
          <Icon size={15} className={ok ? 'text-green-400' : 'text-amber-400'} />
        </div>
        <div>
          <p className="text-sm font-medium text-txt-primary">{name}</p>
          <p className="text-xs text-txt-secondary">I2C Bus / OneWire</p>
        </div>
      </div>
      <span className={`badge ${ok ? 'badge-success' : 'badge-warning'}`}>
        {ok ? '✓ OK' : 'No Data'}
      </span>
    </div>
  );
}

export default function DeviceStatus() {
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const { latestReading, isConnected }  = useLiveData();

  const fetchStatus = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await axios.get('/api/device/status');
      setDeviceStatus(res.data.data);
    } catch (err) {
      console.error('[DeviceStatus] fetch error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-brand-cyan/30 border-t-brand-cyan animate-spin" />
      </div>
    );
  }

  const ds = deviceStatus || {};
  const isOnline = isConnected || ds.isOnline;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Big online/offline hero */}
      <div className={`card border-2 ${isOnline ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
        <div className="flex items-center gap-5 py-2">
          <div className="relative flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center
                            ${isOnline ? 'border-green-500/40 bg-green-500/10' : 'border-red-500/40 bg-red-500/10'}`}>
              {isOnline
                ? <Wifi size={28} className="text-green-400" />
                : <WifiOff size={28} className="text-red-400" />
              }
            </div>
            {isOnline && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-bg-primary animate-pulse" />
            )}
          </div>
          <div>
            <p className={`text-2xl font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isOnline ? 'Device Online' : 'Device Offline'}
            </p>
            <p className="text-sm text-txt-secondary mt-0.5">
              ESP32-C3 Super Mini — GRP05
            </p>
            <p className="text-xs text-txt-secondary mt-1">
              Last seen: {ds.lastSeen ? formatTimestamp(ds.lastSeen) : 'Never'}
              {ds.lastSeen && (
                <span className="ml-2 text-txt-muted">
                  ({formatFullTime(ds.lastSeen)})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => fetchStatus(true)}
            disabled={refreshing}
            className="ml-auto btn-ghost"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Device Info */}
        <div className="card">
          <p className="metric-label mb-4">Device Information</p>
          <div className="space-y-0">
            {[
              { label: 'Device ID',       value: 'ESP32-C3-GRP05' },
              { label: 'Patient ID',      value: 'GRP05-001' },
              { label: 'Firmware',        value: 'v1.0.0' },
              { label: 'MCU',             value: 'ESP32-C3 Super Mini' },
              { label: 'Total Readings',  value: ds.totalReadings?.toLocaleString() ?? '--' },
              { label: 'Battery',         value: `${ds.batteryLevel ?? '--'}%` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
                <span className="text-sm text-txt-secondary">{label}</span>
                <span className="text-sm font-mono text-txt-primary">{value}</span>
              </div>
            ))}
          </div>

          {/* Battery bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-txt-secondary mb-1">
              <span className="flex items-center gap-1"><Battery size={12} /> Battery Level</span>
              <span>{ds.batteryLevel ?? '--'}%</span>
            </div>
            <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  (ds.batteryLevel ?? 0) > 50 ? 'bg-green-500' :
                  (ds.batteryLevel ?? 0) > 20 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${ds.batteryLevel ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sensor Status */}
        <div className="card">
          <p className="metric-label mb-2">Sensor Health</p>
          <div>
            <SensorRow name="MAX30100 — Heart Rate & SpO2" status={ds.sensors?.MAX30100 ?? 'No Data'} icon={Heart} />
            <SensorRow name="MPU-6050 — Accelerometer"     status={ds.sensors?.MPU6050 ?? 'No Data'}  icon={Activity} />
            <SensorRow name="DS18B20 — Temperature"        status={ds.sensors?.DS18B20 ?? 'No Data'}  icon={Thermometer} />
          </div>
        </div>

        {/* Live Readings Snapshot */}
        <div className="card">
          <p className="metric-label mb-4">Current Readings</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Heart Rate',   value: latestReading.heartRate > 0 ? `${Math.round(latestReading.heartRate)} BPM` : '--', color: 'text-brand-cyan' },
              { label: 'SpO2',         value: latestReading.spo2 > 0 ? `${Math.round(latestReading.spo2)}%` : '--',             color: 'text-brand-purple' },
              { label: 'Temperature',  value: latestReading.temperature > 0 ? `${latestReading.temperature.toFixed(1)}°C` : '--', color: 'text-amber-400' },
              { label: 'Health Score', value: `${latestReading.healthScore}/100`,                                                color: 'text-green-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-bg-primary rounded-lg p-3 border border-border">
                <p className="text-xs text-txt-secondary mb-1">{label}</p>
                <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Timeline */}
        <div className="card">
          <p className="metric-label mb-4">
            <span className="flex items-center gap-2"><Clock size={13} /> Connection Info</span>
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="text-xs font-medium text-txt-primary">
                  {isOnline ? 'Connected' : 'Disconnected'}
                </p>
                <p className="text-xs text-txt-secondary">
                  {ds.lastSeen ? formatFullTime(ds.lastSeen) : 'No connection recorded'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-brand-cyan" />
              <div>
                <p className="text-xs font-medium text-txt-primary">ThingSpeak Polling</p>
                <p className="text-xs text-txt-secondary">Every 15 seconds via REST API</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-brand-purple" />
              <div>
                <p className="text-xs font-medium text-txt-primary">Socket.io Live Push</p>
                <p className="text-xs text-txt-secondary">Real-time broadcast to dashboard</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-amber-500" />
              <div>
                <p className="text-xs font-medium text-txt-primary">Alert Endpoint</p>
                <p className="text-xs text-txt-secondary">POST /api/alert on anomaly</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
