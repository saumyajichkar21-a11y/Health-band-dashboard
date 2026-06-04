const express = require('express');
const router = express.Router();
const { getLatestReading, getReadingsHistory } = require('../controllers/readingsController');

router.get('/latest', getLatestReading);
router.get('/history', getReadingsHistory);

module.exports = router;
