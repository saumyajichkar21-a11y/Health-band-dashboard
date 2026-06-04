import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Droplets, Thermometer, Zap } from 'lucide-react';

import { useLiveData }  from '../hooks/useLiveData';
import { useAlerts }    from '../hooks/useAlerts.jsx';

import MetricCard        from '../components/MetricCard';
import HealthScoreGauge  from '../components/HealthScoreGauge';
import HeartRateChart    from '../components/HeartRateChart';
import SpO2Chart         from '../components/SpO2Chart';
import TemperatureChart  from '../components/TemperatureChart';
import AlertBanner       from '../components/AlertBanner';
import AlertFeed         from '../components/AlertFeed';
import DeviceStatusCard  from '../components/DeviceStatusCard';
import ActivityIndicator from '../components/ActivityIndicator';

import {
  getHRStatus, getSpO2Status, getTempStatus, getAccelStatus,
} from '../utils/healthScore';
import { formatBPM, formatSpO2, formatTemp, formatAccel } from '../utils/formatters';

export default function Dashboard() {
  const { latestReading, readingsHistory } = useLiveData();
  const { activeAlert, alerts, dismissAlert } = useAlerts();
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [prevReading, setPrevReading] = useState(null);

  useEffect(() => {
    axios.get('/api/device/status')
      .then(r => setDeviceStatus(r.data.data))
      .catch(() => {});

    const interval = setInterval(() => {
      axios.get('/api/device/status')
        .then(r => setDeviceStatus(r.data.data))
        .catch(() => {});
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (readingsHistory.length >= 2) {
      setPrevReading(readingsHistory[readingsHistory.length - 2]);
    }
  }, [readingsHistory]);

  const { heartRate, spo2, temperature, accelMagnitude, healthScore } = latestReading;
  const recentAlerts = alerts.slice(0, 4);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Alert Banner */}
      {activeAlert && (
        <AlertBanner alert={activeAlert} onDismiss={dismissAlert} />
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Heart Rate"
          value={formatBPM(heartRate)}
          unit="BPM"
          icon={Heart}
          status={getHRStatus(heartRate)}
          previousValue={prevReading?.heartRate}
          subtitle="Cardiac rhythm"
          iconColor="text-red-400"
        />
        <MetricCard
          title="Blood Oxygen"
          value={formatSpO2(spo2)}
          unit="%"
          icon={Droplets}
          status={getSpO2Status(spo2)}
          previousValue={prevReading?.spo2}
          subtitle="SpO2 saturation"
          iconColor="text-purple-400"
        />
        <MetricCard
          title="Temperature"
          value={formatTemp(temperature)}
          unit="°C"
          icon={Thermometer}
          status={getTempStatus(temperature)}
          previousValue={prevReading?.temperature}
          subtitle="Body surface"
          iconColor="text-amber-400"
        />
        <MetricCard
          title="Acceleration"
          value={formatAccel(accelMagnitude)}
          unit="m/s²"
          icon={Zap}
          status={getAccelStatus(accelMagnitude)}
          previousValue={prevReading?.accelMagnitude}
          subtitle="Movement detected"
          iconColor="text-cyan-400"
        />
      </div>

      {/* Heart Rate Chart — full width */}
      <div className="h-64">
        <HeartRateChart data={readingsHistory} />
      </div>

      {/* Middle Row: SpO2 + Temp + Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-64">
          <SpO2Chart data={readingsHistory} compact />
        </div>
        <div className="h-64">
          <TemperatureChart data={readingsHistory} compact />
        </div>
        <div className="h-64">
          <HealthScoreGauge score={healthScore} />
        </div>
      </div>

      {/* Bottom Row: Activity + Alerts + Device */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Activity */}
        <div className="space-y-3">
          <ActivityIndicator accelMag={accelMagnitude} />
          <DeviceStatusCard deviceStatus={deviceStatus} compact />
        </div>

        {/* Recent Alerts */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="metric-label">Recent Alerts</p>
            {recentAlerts.length > 0 && (
              <a href="/alerts" className="text-xs text-brand-cyan hover:underline">
                View all →
              </a>
            )}
          </div>
          <AlertFeed
            alerts={recentAlerts}
            onDismiss={dismissAlert}
            compact
            emptyMessage="No alerts — all vitals normal"
          />
        </div>
      </div>
    </div>
  );
}
