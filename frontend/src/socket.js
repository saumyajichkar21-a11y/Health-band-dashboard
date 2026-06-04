import { io } from 'socket.io-client';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const socket = io(BACKEND_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('[SOCKET] Connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.warn('[SOCKET] Disconnected:', reason);
});

socket.on('connect_error', (err) => {
  console.error('[SOCKET] Error:', err.message);
});

export default socket;