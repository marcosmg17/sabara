
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TriageEntry } from '@/types/triage';
import { usePatientNotifications } from '@/hooks/usePatientNotifications';

export const useConsultationManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { notifyPatient } = usePatientNotifications();
  
  // Get current doctor from localStorage
  const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');

  // Handle starting a consultation
  const handleStartConsultation = (triageId: number) => {
    const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
    
    // Update triage status
    const updatedQueue = currentQueue.map(triage => 
      triage.id === triageId 
        ? { ...triage, status: 'in-progress' as const } 
        : triage
    );
    
    localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
    queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    
    // Notification to the patient
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
    
    toast({
      title: "Consulta iniciada",
      description: "A consulta foi iniciada com sucesso",
    });
  };

  return {
    handleStartConsultation
  };
};
