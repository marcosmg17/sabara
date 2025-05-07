
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TriageEntry } from '@/types/triage';
import { useDoctorConsultations } from './useDoctorConsultations';
import { usePatientNotifications } from './usePatientNotifications';
import { PatientMedicalRecord } from '@/types/patient';

export const usePatientConsultation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { completePatientConsultation } = useDoctorConsultations();
  const { notifyPatient } = usePatientNotifications();
  
  // Function to add consultation to patient history
  const addToPatientHistory = (triage: TriageEntry, currentDoctor: any) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => {
      if (user.id === triage.patientId) {
        // Create medical record
        const medicalHistory = user.medicalHistory || [];
        const newRecord: PatientMedicalRecord = {
          id: Date.now(),
          date: new Date().toISOString(),
          doctor: currentDoctor.name,
          notes: triage.doctorDiagnosis || 'Consulta realizada',
          prescription: triage.prescription,
          observation: triage.doctorObservation,
          measurements: triage.measurements
        };
        medicalHistory.unshift(newRecord);
        
        // Add to triage history
        const triageHistory = user.triageHistory || [];
        const triageRecord = {
          id: Date.now(),
          date: triage.date,
          symptoms: triage.symptoms,
          priority: triage.priority,
          recommendation: `Consulta realizada pelo Dr(a). ${currentDoctor.name}`,
          preTriageNotes: triage.preTriageNotes,
          nurseNotes: triage.nurseNotes,
          doctorDiagnosis: triage.doctorDiagnosis,
          prescription: triage.prescription
        };
        triageHistory.unshift(triageRecord);
        
        // Notify patient
        notifyPatient.mutate({
          patientId: user.id,
          notification: {
            title: "Consulta concluída",
            message: `Sua consulta com Dr(a). ${currentDoctor.name} foi concluída. Verifique as receitas e orientações médicas no seu histórico.`,
          }
        });
        
        return { ...user, medicalHistory, triageHistory };
      }
      return user;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update current user in session if it's the same patient
    updateCurrentUserIfNeeded(triage, currentDoctor);
  };
  
  const updateCurrentUserIfNeeded = (triage: TriageEntry, currentDoctor: any) => {
    const currentUserStr = sessionStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.id === triage.patientId) {
        const medicalHistory = currentUser.medicalHistory || [];
        medicalHistory.unshift({
          id: Date.now(),
          date: new Date().toISOString(),
          doctor: currentDoctor.name,
          notes: triage.doctorDiagnosis || 'Consulta realizada',
          prescription: triage.prescription,
          observation: triage.doctorObservation,
          measurements: triage.measurements
        });
        
        // Add this consultation to patient's triage history
        const triageHistory = currentUser.triageHistory || [];
        const triageRecord = {
          id: Date.now(),
          date: triage.date,
          symptoms: triage.symptoms,
          priority: triage.priority,
          recommendation: `Consulta realizada pelo Dr(a). ${currentDoctor.name}`,
          preTriageNotes: triage.preTriageNotes,
          nurseNotes: triage.nurseNotes,
          doctorDiagnosis: triage.doctorDiagnosis,
          prescription: triage.prescription
        };
        triageHistory.unshift(triageRecord);
        
        // Notify patient
        const notifications = currentUser.notifications || [];
        notifications.unshift({
          id: Date.now(),
          date: new Date().toISOString(),
          title: "Consulta concluída",
          message: `Sua consulta com Dr(a). ${currentDoctor.name} foi concluída. Verifique as receitas e orientações médicas no seu histórico.`,
          read: false
        });
        
        sessionStorage.setItem('currentUser', JSON.stringify({ 
          ...currentUser, 
          medicalHistory, 
          triageHistory,
          notifications 
        }));
      }
    }
  };
  
  const handleCompleteConsultation = (triageId: number) => {
    const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
    const triage = currentQueue.find(t => t.id === triageId);
    const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');
    
    // Add to patient history before completing
    if (triage) {
      addToPatientHistory(triage, currentDoctor);
    }
    
    completePatientConsultation.mutate(triageId);
    
    // Notify success
    toast({
      title: "Consulta finalizada",
      description: "A consulta foi encerrada e os dados foram salvos no histórico do paciente",
    });
    
    return true;
  };

  return {
    handleCompleteConsultation
  };
};
