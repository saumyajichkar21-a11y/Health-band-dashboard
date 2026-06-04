import { useLocation } from 'react-router-dom';
import { formatTimestamp } from '../utils/formatters';

const PAGE_TITLES = {
  '/':         'Live Dashboard',
  '/history':  'Historical Data',
  '/alerts':   'Alerts & Notifications',
  '/device':   'Device Status',
  '/patient':  'Patient Profile',
};

export default function Topbar({ isConnected, isStale, lastUpdated }) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <header className="h-14 bg-bg-secondary border-b border-border flex items-center px-6 gap-4">
      <h1 className="text-base font-semibold text-txt-primary flex-1">{title}</h1>

      {/* Last updated */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-txt-secondary">
        <span>Updated:</span>
        <span className={isStale ? 'text-amber-400' : 'text-txt-secondary'}>
          {lastUpdated ? formatTimestamp(lastUpdated) : 'Waiting...'}
        </span>
      </div>

      {/* Patient ID badge */}
      <span className="badge badge-info">GRP05-001</span>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex items-center justify-center w-2 h-2">
          <span
            className={`status-dot ${
              isConnected ? 'status-dot-online' : 'status-dot-offline'
            }`}
          />
          {isConnected && (
            <span className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping-slow opacity-75" />
          )}
        </div>
        <span
          className={`text-xs font-medium ${
            isConnected ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isConnected ? 'Live' : isStale ? 'Stale' : 'Reconnecting...'}
        </span>
      </div>
    </header>
  );
}
