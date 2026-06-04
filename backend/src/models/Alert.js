const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    default: 'GRP05-001',
  },
  type: {
    type: String,
    enum: ['fall', 'low_hr', 'high_hr', 'low_spo2', 'high_temp', 'low_temp', 'inactivity', 'general'],
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  heartRate: {
    type: Number,
    default: 0,
  },
  spo2: {
    type: Number,
    default: 0,
  },
  temperature: {
    type: Number,
    default: 0,
  },
  healthScore: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'dismissed'],
    default: 'active',
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

alertSchema.index({ timestamp: -1 });
alertSchema.index({ patientId: 1, status: 1 });

module.exports = mongoose.model('Alert', alertSchema);
