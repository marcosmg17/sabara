
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  room: string;
  available: boolean;
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
  assignedRoom: string | null;
  status: 'waiting' | 'assigned' | 'in-progress' | 'completed';
}
