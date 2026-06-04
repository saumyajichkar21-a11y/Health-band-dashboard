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
router.patch('/:id/dismiss', dismissAlert);
router.patch('/dismiss-all', dismissAllAlerts);

module.exports = router;
