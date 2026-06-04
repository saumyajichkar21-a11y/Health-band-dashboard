const Patient = require('../models/Patient');

const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id }).lean();

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const allowed = ['name', 'age', 'bloodGroup', 'gender', 'doctorName', 'emergencyContact', 'medicalNotes'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      updates,
      { new: true, runValidators: true, upsert: false }
    ).lean();

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPatient, updatePatient };
