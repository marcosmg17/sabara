
export interface PatientMedicalRecord {
  id: number;
  date: string;
  doctor: string;
  notes: string;
  prescription?: string;
  observation?: string;
  measurements?: any;
}

export interface Patient {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  email: string;
  medicalHistory: PatientMedicalRecord[];
}
