const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    default: 'GRP05-001',
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
  accelMagnitude: {
    type: Number,
    default: 0,
  },
  healthScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  alertFlag: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

readingSchema.index({ timestamp: -1 });
readingSchema.index({ patientId: 1, timestamp: -1 });

module.exports = mongoose.model('Reading', readingSchema);
