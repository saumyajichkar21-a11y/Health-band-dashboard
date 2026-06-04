require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const connectDB = require('./config/db');
const { initSocket } = require('./services/socketService');
const { startPoller } = require('./services/thingspeakPoller');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const readingsRouter = require('./routes/readings');
const alertsRouter  = require('./routes/alerts');
const deviceRouter  = require('./routes/device');
const patientRouter = require('./routes/patient');

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT'],
    credentials: true,
  },
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    project: 'Smart Health Wristband — GRP05',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/readings', readingsRouter);
app.use('/api/alert',    alertsRouter);
app.use('/api/alerts',   alertsRouter);
app.use('/api/device',   deviceRouter);
app.use('/api/patient',  patientRouter);

app.use(notFound);
app.use(errorHandler);

initSocket(io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n🏥 Smart Health Wristband Backend`);
    console.log(`   Group: GRP05 | Patient: GRP05-001`);
    console.log(`   Server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health\n`);
    startPoller();
  });
});

process.on('SIGTERM', () => {
  console.log('[SERVER] Shutting down gracefully...');
  server.close(() => process.exit(0));
});
