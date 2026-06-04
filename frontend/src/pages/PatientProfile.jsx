import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Phone, Stethoscope, FileText, Save, Edit2, X, Cpu } from 'lucide-react';

const PATIENT_ID = 'GRP05-001';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-txt-secondary w-36 flex-shrink-0">{label}</span>
      <span className="text-sm text-txt-primary font-medium text-right">{value || '--'}</span>
    </div>
  );
}

function SectionCard({ title, icon: Icon, iconColor = 'text-brand-cyan', children }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <div className={`w-8 h-8 rounded-lg bg-bg-primary border border-border flex items-center justify-center`}>
          <Icon size={15} className={iconColor} />
        </div>
        <p className="text-sm font-semibold text-txt-primary">{title}</p>
      </div>
      {children}
    </div>
  );
}

export default function PatientProfile() {
  const [patient, setPatient]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({});

  useEffect(() => {
    axios.get(`/api/patient/${PATIENT_ID}`)
      .then(r => {
        setPatient(r.data.data);
        setForm(r.data.data);
      })
      .catch(err => {
        console.error('[PatientProfile] fetch error:', err.message);
        toast.error('Failed to load patient data');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`/api/patient/${PATIENT_ID}`, form);
      setPatient(res.data.data);
      setForm(res.data.data);
      setEditing(false);
      toast.success('Patient profile updated');
    } catch (err) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(patient);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-brand-cyan/30 border-t-brand-cyan animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-txt-secondary">
        <User size={36} className="mb-3 opacity-30" />
        <p className="text-sm">Patient profile not found</p>
        <p className="text-xs mt-1 opacity-60">Run: npm run seed to create sample data</p>
      </div>
    );
  }

  const inputCls = `w-full bg-bg-primary border border-border rounded-lg px-3 py-2 
                    text-sm text-txt-primary focus:outline-none focus:border-brand-cyan/50
                    transition-colors duration-150`;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header with avatar */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-brand-cyan/20 border-2 border-brand-cyan/30
                        flex items-center justify-center flex-shrink-0">
          <User size={28} className="text-brand-cyan" />
        </div>
        <div className="flex-1">
          <p className="text-xl font-bold text-txt-primary">{patient.name}</p>
          <p className="text-sm text-txt-secondary mt-0.5">
            {patient.age} years • {patient.bloodGroup} • {patient.gender}
          </p>
          <span className="badge badge-info mt-2">{patient.patientId}</span>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
              >
                <Save size={14} />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleCancel} className="btn-ghost">
                <X size={14} /> Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-ghost">
              <Edit2 size={14} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Personal Info */}
        <SectionCard title="Personal Information" icon={User}>
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-txt-secondary mb-1 block">Full Name</label>
                <input className={inputCls} value={form.name || ''} onChange={e => handleChange('name', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-txt-secondary mb-1 block">Age</label>
                  <input className={inputCls} type="number" value={form.age || ''} onChange={e => handleChange('age', parseInt(e.target.value))} />
                </div>
                <div>
                  <label className="text-xs text-txt-secondary mb-1 block">Blood Group</label>
                  <select className={inputCls} value={form.bloodGroup || ''} onChange={e => handleChange('bloodGroup', e.target.value)}>
                    {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-txt-secondary mb-1 block">Gender</label>
                <select className={inputCls} value={form.gender || ''} onChange={e => handleChange('gender', e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <InfoRow label="Full Name"   value={patient.name} />
              <InfoRow label="Age"         value={`${patient.age} years`} />
              <InfoRow label="Blood Group" value={patient.bloodGroup} />
              <InfoRow label="Gender"      value={patient.gender} />
              <InfoRow label="Patient ID"  value={patient.patientId} />
            </div>
          )}
        </SectionCard>

        {/* Doctor Info */}
        <SectionCard title="Medical Team" icon={Stethoscope} iconColor="text-green-400">
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-txt-secondary mb-1 block">Doctor Name</label>
                <input className={inputCls} value={form.doctorName || ''} onChange={e => handleChange('doctorName', e.target.value)} placeholder="Dr. ..." />
              </div>
            </div>
          ) : (
            <div>
              <InfoRow label="Doctor"         value={patient.doctorName} />
              <InfoRow label="Device Assigned" value={patient.deviceAssigned} />
            </div>
          )}

          {/* Device mini info */}
          <div className="mt-4 p-3 rounded-lg bg-bg-primary border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={13} className="text-brand-cyan" />
              <span className="text-xs font-semibold text-txt-primary">Assigned Device</span>
            </div>
            <p className="text-xs text-txt-secondary">ESP32-C3 Super Mini</p>
            <p className="text-xs text-txt-muted mt-0.5">MAX30100 • MPU-6050 • DS18B20 • OLED</p>
          </div>
        </SectionCard>

        {/* Emergency Contact */}
        <SectionCard title="Emergency Contact" icon={Phone} iconColor="text-amber-400">
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-txt-secondary mb-1 block">Contact Name</label>
                <input className={inputCls} value={form.emergencyContact?.name || ''} onChange={e => handleEmergencyChange('name', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-txt-secondary mb-1 block">Phone Number</label>
                <input className={inputCls} value={form.emergencyContact?.phone || ''} onChange={e => handleEmergencyChange('phone', e.target.value)} placeholder="+91-..." />
              </div>
              <div>
                <label className="text-xs text-txt-secondary mb-1 block">Relation</label>
                <input className={inputCls} value={form.emergencyContact?.relation || ''} onChange={e => handleEmergencyChange('relation', e.target.value)} placeholder="Spouse, Son, Daughter..." />
              </div>
            </div>
          ) : (
            <div>
              <InfoRow label="Name"     value={patient.emergencyContact?.name} />
              <InfoRow label="Phone"    value={patient.emergencyContact?.phone} />
              <InfoRow label="Relation" value={patient.emergencyContact?.relation} />
            </div>
          )}
        </SectionCard>

        {/* Medical Notes */}
        <SectionCard title="Medical Notes" icon={FileText} iconColor="text-brand-purple">
          {editing ? (
            <div>
              <label className="text-xs text-txt-secondary mb-1 block">Notes</label>
              <textarea
                className={`${inputCls} h-36 resize-none`}
                value={form.medicalNotes || ''}
                onChange={e => handleChange('medicalNotes', e.target.value)}
                placeholder="Medical history, allergies, medications..."
              />
            </div>
          ) : (
            <p className="text-sm text-txt-secondary leading-relaxed whitespace-pre-wrap">
              {patient.medicalNotes || 'No notes recorded.'}
            </p>
          )}
        </SectionCard>

      </div>
    </div>
  );
}
