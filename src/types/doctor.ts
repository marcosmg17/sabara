export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  room: string;
  available: boolean;
}

// Removing the duplicate TriageEntry definition as it's causing type conflicts
// The application should use the main TriageEntry from triage.ts instead
