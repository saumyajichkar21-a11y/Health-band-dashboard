const Alert = require('../models/Alert');
const { emitNewAlert, emitAlertDismissed } = require('../services/socketService');
const { sendAlertEmail } = require('../services/emailService');
const { detectAlertType } = require('../services/thingspeakPoller');

const receiveAlert = async (req, res, next) => {
  try {
    const {
      patient_id,
      reason,
      heart_rate,
      spo2,
      temperature,
      health_score,
    } = req.body;

    const heartRate = parseFloat(heart_rate) || 0;
    const spo2Val = parseFloat(spo2) || 0;
    const tempVal = parseFloat(temperature) || 0;
    const alertType = detectAlertType(heartRate, spo2Val, tempVal, reason);

    const alert = new Alert({
      patientId: patient_id || 'GRP05-001',
      type: alertType,
      reason: reason || 'Unknown alert',
      heartRate,
      spo2: spo2Val,
      temperature: tempVal,
      healthScore: parseInt(health_score) || 0,
      status: 'active',
    });

    await alert.save();

    const alertObj = alert.toObject();
    emitNewAlert(alertObj);

    sendAlertEmail({
      ...alertObj,
      patientId: alert.patientId,
    }).catch(() => {});

    console.log(`[ALERT] Received and saved: ${alertType} — ${reason}`);

    res.status(201).json({ success: true, data: alertObj });
  } catch (error) {
    next(error);
  }
};

const getAllAlerts = async (req, res, next) => {
  try {
    const filter = { patientId: 'GRP05-001' };

    if (req.query.status && ['active', 'dismissed'].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const alerts = await Alert.find(filter).sort({ timestamp: -1 }).limit(200).lean();

    const counts = {
      total: await Alert.countDocuments({ patientId: 'GRP05-001' }),
      active: await Alert.countDocuments({ patientId: 'GRP05-001', status: 'active' }),
      dismissed: await Alert.countDocuments({ patientId: 'GRP05-001', status: 'dismissed' }),
      fall: await Alert.countDocuments({ patientId: 'GRP05-001', type: 'fall' }),
    };

    res.json({ success: true, counts, data: alerts });
  } catch (error) {
    next(error);
  }
};

const dismissAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'dismissed' },
      { new: true }
    ).lean();

    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    emitAlertDismissed(req.params.id);

    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

const dismissAllAlerts = async (req, res, next) => {
  try {
    await Alert.updateMany(
      { patientId: 'GRP05-001', status: 'active' },
      { status: 'dismissed' }
    );

    emitAlertDismissed('all');

    res.json({ success: true, message: 'All alerts dismissed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { receiveAlert, getAllAlerts, dismissAlert, dismissAllAlerts };
