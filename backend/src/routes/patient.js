const express = require('express');
const router = express.Router();
const { getPatient, updatePatient } = require('../controllers/patientController');

router.get('/:id', getPatient);
router.put('/:id', updatePatient);

module.exports = router;
