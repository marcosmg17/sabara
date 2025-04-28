
import { useQuery } from '@tanstack/react-query';
import { Doctor, TriageEntry } from '@/types/doctor';
import { useDoctorConsultations } from './useDoctorConsultations';

export const useDoctorData = (selectedDoctorId: string) => {
  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => {
      const storedDoctors = localStorage.getItem('doctors');
      return storedDoctors ? JSON.parse(storedDoctors) : [];
    }
  });

  const { data: triageQueue = [] } = useQuery({
    queryKey: ['triageQueue'],
    queryFn: () => {
      const storedQueue = localStorage.getItem('triageQueue');
      return storedQueue ? JSON.parse(storedQueue) : [];
    }
  });

  const { startPatientConsultation, completePatientConsultation } = useDoctorConsultations();

  const selectedDoctor = doctors.find((d: Doctor) => d.id.toString() === selectedDoctorId);
  const assignedPatients = triageQueue.filter((triage: TriageEntry) => 
    triage.assignedDoctor && triage.assignedDoctor.id.toString() === selectedDoctorId
  );

  return {
    doctors,
    selectedDoctor,
    assignedPatients,
    startPatientConsultation,
    completePatientConsultation
  };
};
