require('dotenv').config();
const mongoose = require('mongoose');
const Reading = require('./models/Reading');
const Alert = require('./models/Alert');
const Patient = require('./models/Patient');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthband';

const generateReadings = () => {
  const readings = [];
  const now = Date.now();

  for (let i = 49; i >= 0; i--) {
    const timestamp = new Date(now - i * 15000);
    const heartRate = 65 + Math.round(Math.sin(i * 0.3) * 12 + Math.random() * 6);
    const spo2 = 96 + Math.round(Math.random() * 3);
    const temperature = parseFloat((36.6 + Math.sin(i * 0.1) * 0.4 + Math.random() * 0.2).toFixed(1));
    const accelMagnitude = parseFloat((9.8 + Math.random() * 0.5).toFixed(2));

    let score = 100;
    if (heartRate < 50) score -= 30;
    else if (heartRate < 60) score -= 10;
    else if (heartRate > 120) score -= 25;
    if (spo2 < 90) score -= 40;
    else if (spo2 < 94) score -= 20;
    if (temperature > 38) score -= 10;

    readings.push({
      patientId: 'GRP05-001',
      heartRate,
      spo2,
      temperature,
      accelMagnitude,
      healthScore: Math.max(0, Math.min(100, score)),
      alertFlag: false,
      timestamp,
    });
  }

  readings[10].heartRate = 128;
  readings[10].healthScore = 75;
  readings[10].alertFlag = true;

  readings[25].spo2 = 88;
  readings[25].healthScore = 60;
  readings[25].alertFlag = true;

  readings[38].temperature = 38.5;
  readings[38].healthScore = 90;

  return readings;
};

const sampleAlerts = [
  {
    patientId: 'GRP05-001',
    type: 'high_hr',
    reason: 'High heart rate: 128 BPM',
    heartRate: 128,
    spo2: 97,
    temperature: 36.8,
    healthScore: 75,
    status: 'dismissed',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    patientId: 'GRP05-001',
    type: 'low_spo2',
    reason: 'Low SpO2: 88%',
    heartRate: 72,
    spo2: 88,
    temperature: 36.9,
    healthScore: 60,
    status: 'dismissed',
    timestamp: new Date(Date.now() - 6 * 60 * 1000),
  },
  {
    patientId: 'GRP05-001',
    type: 'fall',
    reason: 'Fall detected',
    heartRate: 95,
    spo2: 96,
    temperature: 37.0,
    healthScore: 80,
    status: 'active',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    patientId: 'GRP05-001',
    type: 'high_temp',
    reason: 'Fever: 38.5°C',
    heartRate: 88,
    spo2: 97,
    temperature: 38.5,
    healthScore: 90,
    status: 'active',
    timestamp: new Date(Date.now() - 30 * 1000),
  },
  {
    patientId: 'GRP05-001',
    type: 'inactivity',
    reason: 'Prolonged inactivity detected (30 minutes)',
    heartRate: 62,
    spo2: 98,
    temperature: 36.6,
    healthScore: 90,
    status: 'dismissed',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
  },
];

const samplePatient = {
  patientId: 'GRP05-001',
  name: 'Rajesh Kumar',
  age: 58,
  bloodGroup: 'B+',
  gender: 'Male',
  doctorName: 'Dr. Priya Sharma',
  emergencyContact: {
    name: 'Sunita Kumar',
    phone: '+91-98765-43210',
    relation: 'Spouse',
  },
  medicalNotes:
    'Patient has history of mild hypertension. On medication: Amlodipine 5mg. Regular monitoring required. No known allergies.',
  deviceAssigned: 'ESP32-C3-GRP05',
};

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[SEED] Connected to MongoDB');

    await Reading.deleteMany({ patientId: 'GRP05-001' });
    await Alert.deleteMany({ patientId: 'GRP05-001' });
    await Patient.deleteOne({ patientId: 'GRP05-001' });
    console.log('[SEED] Cleared existing data');

    await Reading.insertMany(generateReadings());
    console.log('[SEED] Inserted 50 readings');

    await Alert.insertMany(sampleAlerts);
    console.log('[SEED] Inserted 5 alerts');

    await Patient.create(samplePatient);
    console.log('[SEED] Inserted patient profile');

    console.log('[SEED] ✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[SEED] Error:', error.message);
    process.exit(1);
  }
};

seed();
