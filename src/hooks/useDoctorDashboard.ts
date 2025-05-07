
import { useState } from 'react';
import { useDoctorData } from '@/hooks/useDoctorData';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTriageActions } from '@/hooks/useTriageActions';
import { usePatientNotifications } from '@/hooks/usePatientNotifications';
import { usePatientConsultation } from '@/hooks/usePatientConsultation';
import { TriageEntry } from '@/types/triage';

export const useDoctorDashboard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { assignToUTI } = useTriageActions();
  const { notifyPatient } = usePatientNotifications();
  const { handleCompleteConsultation } = usePatientConsultation();
  
  // Get current doctor from localStorage
  const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');
  const selectedDoctorId = currentDoctor.id ? currentDoctor.id.toString() : '';
  
  // UI state management
  const [selectedTriage, setSelectedTriage] = useState<TriageEntry | null>(null);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [selectedTriageId, setSelectedTriageId] = useState<number | null>(null);
  const [isUtiDialogOpen, setIsUtiDialogOpen] = useState(false);
  
  // Get doctor data and related functions
  const {
    selectedDoctor,
    assignedPatients,
    startPatientConsultation
  } = useDoctorData(selectedDoctorId);

  // Set up polling to update the triage queue regularly
  const setupPolling = () => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    }, 3000); // Updates every 3 seconds
    
    return () => clearInterval(interval);
  };

  // Handle starting a consultation
  const handleStartConsultation = (triageId: number) => {
    startPatientConsultation.mutate(triageId);
    
    // Notification to the patient
    const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
    const triage = currentQueue.find(t => t.id === triageId);
    if (triage) {
      notifyPatient.mutate({
        patientId: triage.patientId,
        notification: {
          title: "Consulta iniciada",
          message: `O Dr. ${currentDoctor.name || 'médico(a)'} começou sua consulta. Por favor, aguarde na sala ${triage.assignedRoom || 'indicada'}.`
        }
      });
    }
  };

  // Handle opening the prescription dialog
  const handleOpenPrescription = (triage: TriageEntry) => {
    setSelectedTriage(triage);
    setIsPrescriptionOpen(true);
  };

  // Handle saving a prescription
  const handleSavePrescription = (triageId: number, diagnosis: string, prescription: string, observation?: string) => {
    const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
    
    const updatedQueue = currentQueue.map(triage => 
      triage.id === triageId 
        ? { 
            ...triage,
            doctorDiagnosis: diagnosis,
            prescription: prescription,
            doctorObservation: observation
          } 
        : triage
    );
    
    localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
    queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    
    toast({
      title: "Prescrição salva",
      description: "Os dados do atendimento foram salvos com sucesso",
    });
  };

  // Handle assigning patient to UTI
  const handleAssignUTI = (triageId: number) => {
    setSelectedTriageId(triageId);
    setIsUtiDialogOpen(true);
    setIsPrescriptionOpen(false);
  };
  
  // Handle UTI bed assignment
  const handleUTIAssignment = (triageId: number, bedId: string) => {
    assignToUTI.mutate({ triageId, bedId });
    setIsUtiDialogOpen(false);
  };

  // Close prescription dialog
  const handleClosePrescriptionDialog = () => {
    setIsPrescriptionOpen(false);
  };

  // Close UTI dialog
  const handleCloseUTIDialog = () => {
    setIsUtiDialogOpen(false);
  };

  return {
    selectedDoctor,
    assignedPatients,
    selectedTriage,
    isPrescriptionOpen,
    selectedTriageId,
    isUtiDialogOpen,
    setupPolling,
    handleStartConsultation,
    handleOpenPrescription,
    handleSavePrescription,
    handleClosePrescriptionDialog,
    handleCompleteConsultation,
    handleAssignUTI,
    handleUTIAssignment,
    handleCloseUTIDialog
  };
};
