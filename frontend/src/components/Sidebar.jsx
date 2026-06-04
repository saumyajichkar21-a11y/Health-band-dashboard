import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BarChart2, Bell, Wifi, User,
  Activity, Heart,
} from 'lucide-react';

const navItems = [
  { to: '/',        label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/history', label: 'History',        icon: BarChart2 },
  { to: '/alerts',  label: 'Alerts',         icon: Bell },
  { to: '/device',  label: 'Device Status',  icon: Wifi },
  { to: '/patient', label: 'Patient Profile', icon: User },
];

export default function Sidebar({ isConnected, activeAlertCount }) {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-bg-secondary border-r border-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center">
            <Heart size={16} className="text-brand-cyan" />
          </div>
          <div>
            <p className="text-sm font-semibold text-txt-primary leading-tight">HealthBand</p>
            <p className="text-xs text-txt-secondary leading-tight">GRP05</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              className={isActive ? 'nav-link-active' : 'nav-link'}
            >
              <Icon size={17} />
              <span>{label}</span>
              {to === '/alerts' && activeAlertCount > 0 && (
                <span className="ml-auto text-xs font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {activeAlertCount > 9 ? '9+' : activeAlertCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer — Connection Status */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className={`status-dot ${isConnected ? 'status-dot-online' : 'status-dot-offline'}`} />
            {isConnected && (
              <span className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping-slow opacity-60" />
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-txt-primary">
              {isConnected ? 'Live' : 'Offline'}
            </p>
            <p className="text-xs text-txt-secondary">GRP05-001</p>
          </div>
          <Activity
            size={14}
            className={`ml-auto ${isConnected ? 'text-green-400' : 'text-txt-muted'}`}
          />
        </div>
      </div>
    </aside>
  );
}
