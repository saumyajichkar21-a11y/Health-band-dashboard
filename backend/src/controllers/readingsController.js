const Reading = require('../models/Reading');

const getLatestReading = async (req, res, next) => {
  try {
    const reading = await Reading.findOne({ patientId: 'GRP05-001' })
      .sort({ timestamp: -1 })
      .lean();

    if (!reading) {
      return res.json({
        success: true,
        data: null,
        message: 'No readings available yet',
      });
    }

    res.json({ success: true, data: reading });
  } catch (error) {
    next(error);
  }
};

const getReadingsHistory = async (req, res, next) => {
  try {
    const range = req.query.range || '1h';

    const rangeMap = {
      '1h': 1 * 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
    };

    const duration = rangeMap[range] || rangeMap['1h'];
    const since = new Date(Date.now() - duration);

    const readings = await Reading.find({
      patientId: 'GRP05-001',
      timestamp: { $gte: since },
    })
      .sort({ timestamp: 1 })
      .lean();

    const stats = readings.length > 0 ? {
      heartRate: {
        min: Math.min(...readings.filter(r => r.heartRate > 0).map(r => r.heartRate)),
        max: Math.max(...readings.filter(r => r.heartRate > 0).map(r => r.heartRate)),
        avg: parseFloat((readings.filter(r => r.heartRate > 0).reduce((s, r) => s + r.heartRate, 0) / (readings.filter(r => r.heartRate > 0).length || 1)).toFixed(1)),
      },
      spo2: {
        min: Math.min(...readings.filter(r => r.spo2 > 0).map(r => r.spo2)),
        max: Math.max(...readings.filter(r => r.spo2 > 0).map(r => r.spo2)),
        avg: parseFloat((readings.filter(r => r.spo2 > 0).reduce((s, r) => s + r.spo2, 0) / (readings.filter(r => r.spo2 > 0).length || 1)).toFixed(1)),
      },
      temperature: {
        min: parseFloat(Math.min(...readings.filter(r => r.temperature > 0).map(r => r.temperature)).toFixed(1)),
        max: parseFloat(Math.max(...readings.filter(r => r.temperature > 0).map(r => r.temperature)).toFixed(1)),
        avg: parseFloat((readings.filter(r => r.temperature > 0).reduce((s, r) => s + r.temperature, 0) / (readings.filter(r => r.temperature > 0).length || 1)).toFixed(1)),
      },
    } : null;

    res.json({
      success: true,
      count: readings.length,
      range,
      stats,
      data: readings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLatestReading, getReadingsHistory };
