const axios = require('axios');
const Reading = require('../models/Reading');
const { emitSensorUpdate } = require('./socketService');

let lastEntryId = null;
let deviceLastSeen = null;
let pollerInterval = null;

const getDeviceLastSeen = () => deviceLastSeen;

const computeHealthScore = (heartRate, spo2, temperature) => {
  let score = 100;

  if (heartRate > 0) {
    if (heartRate < 50) score -= 30;
    else if (heartRate < 60) score -= 10;
    else if (heartRate > 120) score -= 25;
    else if (heartRate > 100) score -= 10;
  }

  if (spo2 > 0) {
    if (spo2 < 90) score -= 40;
    else if (spo2 < 94) score -= 20;
    else if (spo2 < 96) score -= 10;
  }

  if (temperature > 0) {
    if (temperature > 39.5) score -= 20;
    else if (temperature > 38) score -= 10;
    else if (temperature < 35) score -= 15;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

const detectAlertType = (heartRate, spo2, temperature, reason) => {
  if (reason && reason.toLowerCase().includes('fall')) return 'fall';
  if (reason && reason.toLowerCase().includes('inactivity')) return 'inactivity';
  if (heartRate > 0 && heartRate < 50) return 'low_hr';
  if (heartRate > 120) return 'high_hr';
  if (spo2 > 0 && spo2 < 90) return 'low_spo2';
  if (temperature > 38) return 'high_temp';
  if (temperature > 0 && temperature < 35) return 'low_temp';
  return 'general';
};

const pollThingSpeak = async () => {
  const channelId = process.env.THINGSPEAK_CHANNEL_ID;
  const apiKey = process.env.THINGSPEAK_READ_API_KEY;

  if (!channelId || channelId === 'your_channel_id_here') {
    return;
  }

  try {
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds/last.json?api_key=${apiKey}`;
    const response = await axios.get(url, { timeout: 8000 });
    const feed = response.data;

    if (!feed || !feed.entry_id) return;
    if (feed.entry_id === lastEntryId) return;

    lastEntryId = feed.entry_id;
    deviceLastSeen = new Date();

    const heartRate = parseFloat(feed.field1) || 0;
    const spo2 = parseFloat(feed.field2) || 0;
    const temperature = parseFloat(feed.field3) || 0;
    const accelMagnitude = parseFloat(feed.field4) || 0;
    const alertFlag = parseInt(feed.field6) === 1;

    const healthScore = feed.field5
      ? parseInt(feed.field5)
      : computeHealthScore(heartRate, spo2, temperature);

    const reading = new Reading({
      patientId: 'GRP05-001',
      heartRate,
      spo2,
      temperature,
      accelMagnitude,
      healthScore,
      alertFlag,
      timestamp: new Date(feed.created_at) || new Date(),
    });

    await reading.save();

    const readingObj = reading.toObject();
    emitSensorUpdate(readingObj);

    console.log(
      `[POLLER] New reading — HR: ${heartRate} BPM | SpO2: ${spo2}% | Temp: ${temperature}°C | Score: ${healthScore}`
    );
  } catch (error) {
    if (error.code !== 'ECONNABORTED') {
      console.error(`[POLLER] ThingSpeak fetch error: ${error.message}`);
    }
  }
};

const startPoller = () => {
  console.log('[POLLER] ThingSpeak poller started (15s interval)');
  pollThingSpeak();
  pollerInterval = setInterval(pollThingSpeak, 15000);
};

const stopPoller = () => {
  if (pollerInterval) {
    clearInterval(pollerInterval);
    pollerInterval = null;
    console.log('[POLLER] ThingSpeak poller stopped');
  }
};

module.exports = { startPoller, stopPoller, getDeviceLastSeen, detectAlertType, computeHealthScore };
