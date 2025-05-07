
export interface PatientMedicalRecord {
  id: number;
  date: string;
  doctor: string;
  notes: string;
  prescription?: string;
  observation?: string;
  measurements?: {
    temperature?: number;
    heartRate?: number;
    bloodPressure?: string;
    oxygenSaturation?: number;
    glucoseLevel?: number;
  };
}

export interface PatientNotification {
  id: number;
  date: string;
  title: string;
  message: string;
  read: boolean;
}

export interface Patient {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  email: string;
  medicalHistory: PatientMedicalRecord[];
  notifications?: PatientNotification[];
  triageHistory?: any[];
}
