
export type NurseStatus = 'available' | 'busy' | 'away' | 'offline';

export interface Nurse {
  id: number;
  name: string;
  available: boolean;
  status: NurseStatus;
  room?: string;
  specialty?: string;
  imageUrl?: string;
  currentTriageId?: number;
}
