const Reading = require('../models/Reading');
const { getDeviceLastSeen } = require('../services/thingspeakPoller');

const getDeviceStatus = async (req, res, next) => {
  try {
    const lastReading = await Reading.findOne({ patientId: 'GRP05-001' })
      .sort({ timestamp: -1 })
      .lean();

    const lastSeen = getDeviceLastSeen() || (lastReading ? lastReading.timestamp : null);
    const now = Date.now();
    const secondsSinceLastSeen = lastSeen
      ? Math.floor((now - new Date(lastSeen).getTime()) / 1000)
      : null;

    const isOnline = secondsSinceLastSeen !== null && secondsSinceLastSeen < 30;

    const uptimeSeconds = lastReading
      ? Math.floor((now - new Date(lastReading.timestamp).getTime()) / 1000)
      : 0;

    const totalReadings = await Reading.countDocuments({ patientId: 'GRP05-001' });

    res.json({
      success: true,
      data: {
        isOnline,
        lastSeen: lastSeen || null,
        secondsSinceLastSeen,
        patientId: 'GRP05-001',
        deviceId: 'ESP32-C3-GRP05',
        firmwareVersion: '1.0.0',
        sensors: {
          MAX30100: lastReading && lastReading.heartRate > 0 ? 'OK' : 'No Data',
          MPU6050: lastReading && lastReading.accelMagnitude > 0 ? 'OK' : 'No Data',
          DS18B20: lastReading && lastReading.temperature > 0 ? 'OK' : 'No Data',
        },
        totalReadings,
        batteryLevel: 78,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDeviceStatus };
