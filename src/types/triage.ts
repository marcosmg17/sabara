
import { Doctor } from './doctor';
import { Nurse } from './nurse';

export interface TriageMeasurements {
  temperature?: number;
  heartRate?: number;
  bloodPressure?: string;
  oxygenSaturation?: number;
  glucoseLevel?: number;
}

export interface TriageEntry {
  id: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientId: number;
  date: string;
  symptoms: string[];
  priority: string;
  assignedDoctor: Doctor | null;
  assignedNurse: Nurse | null;
  assignedRoom: string | null;
  status: 'waiting' | 'nurse-triage' | 'assigned' | 'in-progress' | 'completed' | 'uti';
  measurements: TriageMeasurements;
  preTriageNotes?: string;
  nurseNotes?: string;
  doctorDiagnosis?: string;
  prescription?: string;
}
