import { GoogleGenerativeAI } from '@google/generative-ai';
import { Patient, Nurse, MedicationReminder } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generatePatientSummary = async (patientId) => {
  try {
    const patient = await Patient.findById(patientId)
      .populate('doctorId', 'name')
      .populate('nurseId', 'name');

    if (!patient) {
      throw new ApiError(404, 'Patient not found');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Generate a concise AI medical summary for this patient:
Name: ${patient.name}
Age: ${calculateAge(patient.dob)}
Condition: ${patient.condition}
Severity: ${patient.severity}
Assigned Doctor: ${patient.doctorId?.name || 'Not assigned'}
Assigned Nurse: ${patient.nurseId?.name || 'Not assigned'}

Provide a brief clinical summary including:
1. Current condition overview
2. Recommended monitoring
3. Potential risk factors
4. Suggested interventions

Keep it professional and concise (max 200 words).`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    patient.aiSummary = summary;
    await patient.save();

    return { summary, patient };
  } catch (error) {
    console.error('AI Summary Generation Error:', error);
    throw new ApiError(500, 'Failed to generate AI summary');
  }
};

const recommendNurse = async (patientId, shift) => {
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, 'Patient not found');
    }

    const availableNurses = await Nurse.find({
      shift: shift || patient.nurseId ? undefined : { $in: ['day', 'night'] },
      available: true,
    }).populate('specialties');

    if (availableNurses.length === 0) {
      throw new ApiError(404, 'No available nurses found');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const nurseProfiles = availableNurses.map(n => ({
      id: n._id,
      name: n.name,
      experience: n.experience,
      shift: n.shift,
      available: n.available,
    }));

    const prompt = `Recommend the best nurse for this patient:
Patient Condition: ${patient.condition}
Patient Severity: ${patient.severity}

Available Nurses:
${JSON.stringify(nurseProfiles)}

Consider experience level and shift compatibility. Return only the nurse ID that is the best match.`;

    const result = await model.generateContent(prompt);
    const recommendedId = result.response.text().trim();

    const recommendedNurse = availableNurses.find(n => n._id.toString() === recommendedId);

    return recommendedNurse || availableNurses[0];
  } catch (error) {
    console.error('Nurse Recommendation Error:', error);
    throw new ApiError(500, 'Failed to recommend nurse');
  }
};

const analyzeMedicationCompliance = async (patientId) => {
  try {
    const reminders = await MedicationReminder.find({ patientId })
      .sort({ scheduledAt: -1 })
      .limit(50);

    const total = reminders.length;
    const acknowledged = reminders.filter(r => r.progress === 'done').length;
    const complianceRate = total > 0 ? (acknowledged / total) * 100 : 0;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Analyze medication compliance for this patient:
Total Medications: ${total}
Acknowledged: ${acknowledged}
Compliance Rate: ${complianceRate.toFixed(1)}%

Provide a brief analysis and recommendations to improve compliance if needed.`;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    return { complianceRate, analysis };
  } catch (error) {
    console.error('Compliance Analysis Error:', error);
    throw new ApiError(500, 'Failed to analyze medication compliance');
  }
};

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export {
  generatePatientSummary,
  recommendNurse,
  analyzeMedicationCompliance,
};