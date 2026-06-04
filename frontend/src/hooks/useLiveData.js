import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import socket from '../socket';

const MAX_HISTORY = 30;

const emptyReading = {
  heartRate: 0,
  spo2: 0,
  temperature: 0,
  accelMagnitude: 0,
  healthScore: 100,
  alertFlag: false,
  timestamp: null,
};

export const useLiveData = () => {
  const [latestReading, setLatestReading]   = useState(emptyReading);
  const [readingsHistory, setReadingsHistory] = useState([]);
  const [isConnected, setIsConnected]       = useState(false);
  const [isStale, setIsStale]               = useState(false);
  const staleTimerRef = useRef(null);

  const resetStaleTimer = useCallback(() => {
    setIsStale(false);
    if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    staleTimerRef.current = setTimeout(() => setIsStale(true), 30000);
  }, []);

  const addReading = useCallback((reading) => {
    setLatestReading(reading);
    setReadingsHistory((prev) => {
      const updated = [...prev, reading];
      return updated.slice(-MAX_HISTORY);
    });
    resetStaleTimer();
  }, [resetStaleTimer]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await axios.get('/api/readings/history?range=1h');
        if (res.data.data && res.data.data.length > 0) {
          const readings = res.data.data.slice(-MAX_HISTORY);
          setReadingsHistory(readings);
          setLatestReading(readings[readings.length - 1]);
          resetStaleTimer();
        }
      } catch (err) {
        console.error('[useLiveData] Initial fetch error:', err.message);
      }
    };

    fetchInitial();
  }, [resetStaleTimer]);

  useEffect(() => {
    const onConnect    = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onUpdate     = (data) => addReading(data);

    socket.on('connect',       onConnect);
    socket.on('disconnect',    onDisconnect);
    socket.on('sensor-update', onUpdate);

    if (socket.connected) setIsConnected(true);

    return () => {
      socket.off('connect',       onConnect);
      socket.off('disconnect',    onDisconnect);
      socket.off('sensor-update', onUpdate);
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    };
  }, [addReading]);

  return { latestReading, readingsHistory, isConnected, isStale };
};
