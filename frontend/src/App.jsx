import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Sidebar   from './components/Sidebar';
import Topbar    from './components/Topbar';

import Dashboard     from './pages/Dashboard';
import History       from './pages/History';
import AlertsPage    from './pages/Alerts';
import DeviceStatus  from './pages/DeviceStatus';
import PatientProfile from './pages/PatientProfile';

import { useLiveData } from './hooks/useLiveData';
import { useAlerts }   from './hooks/useAlerts';

function Layout() {
  const { latestReading, isConnected, isStale } = useLiveData();
  const { counts } = useAlerts();

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar
        isConnected={isConnected}
        activeAlertCount={counts.active}
      />

      <div className="flex-1 flex flex-col ml-60 min-w-0">
        <Topbar
          isConnected={isConnected}
          isStale={isStale}
          lastUpdated={latestReading?.timestamp}
        />

        <main className="flex-1 overflow-y-auto p-5">
          <Routes>
            <Route path="/"        element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/alerts"  element={<AlertsPage />} />
            <Route path="/device"  element={<DeviceStatus />} />
            <Route path="/patient" element={<PatientProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '10px',
            fontSize: '13px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#0f172a' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
          },
          duration: 3000,
        }}
      />
    </BrowserRouter>
  );
}
