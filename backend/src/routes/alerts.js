const express = require('express');
const router = express.Router();
const {
  receiveAlert,
  getAllAlerts,
  dismissAlert,
  dismissAllAlerts,
} = require('../controllers/alertsController');

router.post('/', receiveAlert);
router.get('/', getAllAlerts);
router.patch('/dismiss-all', dismissAllAlerts);  // MUST be before /:id/dismiss
router.patch('/:id/dismiss', dismissAlert);

module.exports = router;
