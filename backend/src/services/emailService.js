const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const getAlertTypeLabel = (type) => {
  const labels = {
    fall: '🚨 Fall Detected',
    low_hr: '💔 Low Heart Rate',
    high_hr: '❤️‍🔥 High Heart Rate',
    low_spo2: '🫁 Low Blood Oxygen (SpO2)',
    high_temp: '🌡️ High Temperature / Fever',
    low_temp: '🥶 Low Temperature / Hypothermia',
    inactivity: '😴 Prolonged Inactivity',
    general: '⚠️ Health Alert',
  };
  return labels[type] || '⚠️ Health Alert';
};

const getStatusColor = (score) => {
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

const sendAlertEmail = async (alertData) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ALERT_EMAIL_TO) {
    console.log('[EMAIL] Email credentials not configured — skipping email alert');
    return;
  }

  try {
    const transporter = createTransporter();
    const alertLabel = getAlertTypeLabel(alertData.type);
    const scoreColor = getStatusColor(alertData.healthScore);
    const timestamp = new Date(alertData.timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #0f172a; color: #f1f5f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 24px auto; background: #1e293b; border-radius: 12px; overflow: hidden; }
    .header { background: #ef4444; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; color: #fff; }
    .header p { margin: 6px 0 0; color: #fecaca; font-size: 14px; }
    .body { padding: 24px; }
    .alert-reason { background: #7f1d1d; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 15px; color: #fecaca; }
    .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .metric { background: #0f172a; border-radius: 8px; padding: 14px; text-align: center; }
    .metric-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .metric-value { font-size: 24px; font-weight: bold; color: #06b6d4; }
    .metric-unit { font-size: 12px; color: #64748b; }
    .score-box { background: #0f172a; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 20px; }
    .score-value { font-size: 40px; font-weight: bold; }
    .footer { padding: 16px 24px; background: #0f172a; font-size: 12px; color: #475569; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${alertLabel}</h1>
      <p>Smart Health Wristband — Patient ${alertData.patientId || 'GRP05-001'}</p>
    </div>
    <div class="body">
      <div class="alert-reason">${alertData.reason}</div>
      <div class="metrics">
        <div class="metric">
          <div class="metric-label">Heart Rate</div>
          <div class="metric-value">${alertData.heartRate > 0 ? Math.round(alertData.heartRate) : '--'}</div>
          <div class="metric-unit">BPM</div>
        </div>
        <div class="metric">
          <div class="metric-label">SpO2</div>
          <div class="metric-value">${alertData.spo2 > 0 ? Math.round(alertData.spo2) : '--'}</div>
          <div class="metric-unit">%</div>
        </div>
        <div class="metric">
          <div class="metric-label">Temperature</div>
          <div class="metric-value">${alertData.temperature > 0 ? alertData.temperature.toFixed(1) : '--'}</div>
          <div class="metric-unit">°C</div>
        </div>
        <div class="metric">
          <div class="metric-label">Health Score</div>
          <div class="metric-value" style="color: ${scoreColor}">${alertData.healthScore || '--'}</div>
          <div class="metric-unit">/ 100</div>
        </div>
      </div>
      <div class="score-box">
        <div class="metric-label">Alert Time</div>
        <div style="color: #94a3b8; font-size: 14px; margin-top: 4px;">${timestamp}</div>
      </div>
      <p style="color: #94a3b8; font-size: 13px; margin: 0;">
        Please check on the patient immediately. You can dismiss this alert from the 
        <strong style="color: #06b6d4;">HealthBand Dashboard</strong>.
      </p>
    </div>
    <div class="footer">
      Smart Health Wristband Monitoring System — GRP05 | ESP32-C3 Super Mini
    </div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
      from: `"HealthBand Alert" <${process.env.EMAIL_USER}>`,
      to: process.env.ALERT_EMAIL_TO,
      subject: `[ALERT] ${alertLabel} — Patient ${alertData.patientId || 'GRP05-001'}`,
      html: htmlBody,
    });

    console.log(`[EMAIL] Alert email sent to ${process.env.ALERT_EMAIL_TO}`);
  } catch (error) {
    console.error(`[EMAIL] Failed to send alert email: ${error.message}`);
  }
};

module.exports = { sendAlertEmail };
