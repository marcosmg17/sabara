
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TriageEntry } from '@/types/triage';
import { usePatientNotifications } from '@/hooks/usePatientNotifications';

export const usePrescriptionManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { notifyPatient } = usePatientNotifications();
  
  // Save prescription to localStorage and notify patient
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
    
    // Find patient to notify
    const triage = currentQueue.find(t => t.id === triageId);
    if (triage) {
      notifyPatient.mutate({
        patientId: triage.patientId,
        notification: {
          title: "Prescrição médica disponível",
          message: "Uma nova prescrição médica está disponível para você."
        }
      });
    }
    
    toast({
      title: "Prescrição salva",
      description: "Os dados do atendimento foram salvos com sucesso",
    });
  };

  return {
    handleSavePrescription
  };
};
