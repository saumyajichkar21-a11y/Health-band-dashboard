let io = null;

const initSocket = (socketIo) => {
  io = socketIo;

  io.on('connection', (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[SOCKET] Client disconnected: ${socket.id}`);
    });

    socket.on('dismiss-alert', (alertId) => {
      console.log(`[SOCKET] Alert dismiss requested: ${alertId}`);
      io.emit('alert-dismissed', alertId);
    });
  });
};

const emitSensorUpdate = (data) => {
  if (io) {
    io.emit('sensor-update', data);
  }
};

const emitNewAlert = (alert) => {
  if (io) {
    io.emit('new-alert', alert);
  }
};

const emitAlertDismissed = (alertId) => {
  if (io) {
    io.emit('alert-dismissed', alertId);
  }
};

module.exports = { initSocket, emitSensorUpdate, emitNewAlert, emitAlertDismissed };
