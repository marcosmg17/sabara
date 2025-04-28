
export interface PatientMedicalRecord {
  id: number;
  date: string;
  doctor: string;
  notes: string;
}

export interface Patient {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  email: string;
  medicalHistory: PatientMedicalRecord[];
}
