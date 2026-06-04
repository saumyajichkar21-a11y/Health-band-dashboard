import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import socket from '../socket';
import { getAlertTypeLabel } from '../utils/formatters';

export const useAlerts = () => {
  const [alerts, setAlerts]       = useState([]);
  const [counts, setCounts]       = useState({ total: 0, active: 0, dismissed: 0, fall: 0 });
  const [loading, setLoading]     = useState(true);

  const activeAlert = alerts.find((a) => a.status === 'active') || null;

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await axios.get('/api/alerts');
      setAlerts(res.data.data || []);
      setCounts(res.data.counts || { total: 0, active: 0, dismissed: 0, fall: 0 });
    } catch (err) {
      console.error('[useAlerts] Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const dismissAlert = useCallback(async (id) => {
    try {
      await axios.patch(`/api/alerts/${id}/dismiss`);
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: 'dismissed' } : a))
      );
      setCounts((prev) => ({
        ...prev,
        active:    Math.max(0, prev.active - 1),
        dismissed: prev.dismissed + 1,
      }));
    } catch (err) {
      toast.error('Failed to dismiss alert');
    }
  }, []);

  const dismissAll = useCallback(async () => {
    try {
      await axios.patch('/api/alerts/dismiss-all');
      setAlerts((prev) => prev.map((a) => ({ ...a, status: 'dismissed' })));
      setCounts((prev) => ({
        ...prev,
        dismissed: prev.dismissed + prev.active,
        active: 0,
      }));
    } catch (err) {
      toast.error('Failed to dismiss all alerts');
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    const onNewAlert = (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      setCounts((prev) => ({
        ...prev,
        total:  prev.total + 1,
        active: prev.active + 1,
        ...(alert.type === 'fall' ? { fall: prev.fall + 1 } : {}),
      }));

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-slide-in' : 'opacity-0'
            } flex items-center gap-3 bg-red-900/90 border border-red-500/50 
               text-white px-4 py-3 rounded-xl shadow-2xl max-w-sm`}
          >
            <span className="text-xl">🚨</span>
            <div>
              <p className="font-semibold text-sm">{getAlertTypeLabel(alert.type)}</p>
              <p className="text-xs text-red-200 mt-0.5">{alert.reason}</p>
            </div>
          </div>
        ),
        { duration: 6000, position: 'top-right' }
      );
    };

    const onDismissed = (id) => {
      if (id === 'all') {
        setAlerts((prev) => prev.map((a) => ({ ...a, status: 'dismissed' })));
        setCounts((prev) => ({ ...prev, dismissed: prev.dismissed + prev.active, active: 0 }));
      } else {
        setAlerts((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: 'dismissed' } : a))
        );
      }
    };

    socket.on('new-alert',       onNewAlert);
    socket.on('alert-dismissed', onDismissed);

    return () => {
      socket.off('new-alert',       onNewAlert);
      socket.off('alert-dismissed', onDismissed);
    };
  }, []);

  return { alerts, counts, activeAlert, loading, dismissAlert, dismissAll, refetch: fetchAlerts };
};
