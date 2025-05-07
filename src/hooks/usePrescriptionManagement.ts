
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TriageEntry } from '@/types/triage';
import { usePatientNotifications } from '@/hooks/usePatientNotifications';
import { PatientMedicalRecord } from '@/types/patient';

export const usePrescriptionManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { notifyPatient } = usePatientNotifications();
  
  // Save prescription to localStorage and notify patient
  const handleSavePrescription = (triageId: number, diagnosis: string, prescription: string, observation?: string) => {
    const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
    const triage = currentQueue.find(t => t.id === triageId);
    
    if (!triage) {
      toast({
        title: "Erro",
        description: "Paciente não encontrado na fila de triagem",
        variant: "destructive"
      });
      return;
    }
    
    // Update triage queue with prescription information
    const updatedQueue = currentQueue.map(t => 
      t.id === triageId 
        ? { 
            ...t,
            doctorDiagnosis: diagnosis,
            prescription: prescription,
            doctorObservation: observation
          } 
        : t
    );
    
    localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
    queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    
    // Update patient medical history
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => {
      if (user.id === triage.patientId) {
        const medicalHistory = user.medicalHistory || [];
        const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');
        
        // Create new medical record
        const newRecord: PatientMedicalRecord = {
          id: Date.now(),
          date: new Date().toISOString(),
          doctor: currentDoctor.name || "Médico Hospital Sabará",
          notes: diagnosis,
          prescription: prescription,
          observation: observation,
          measurements: triage.measurements
        };
        
        medicalHistory.unshift(newRecord);
        return { ...user, medicalHistory };
      }
      return user;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Find patient to notify
    if (triage) {
      notifyPatient.mutate({
        patientId: triage.patientId,
        notification: {
          title: "Prescrição médica disponível",
          message: "Uma nova prescrição médica está disponível para você no seu histórico."
        }
      });
    }
    
    // Update current user in session if it's the same patient
    updateCurrentUserIfNeeded(triage.patientId, diagnosis, prescription, observation, triage.measurements);
    
    toast({
      title: "Prescrição salva",
      description: "Os dados do atendimento foram salvos com sucesso no histórico do paciente.",
    });
  };

  const updateCurrentUserIfNeeded = (
    patientId: number, 
    diagnosis: string, 
    prescription: string, 
    observation?: string,
    measurements?: any
  ) => {
    const currentUserStr = sessionStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.id === patientId) {
        const medicalHistory = currentUser.medicalHistory || [];
        const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');
        
        medicalHistory.unshift({
          id: Date.now(),
          date: new Date().toISOString(),
          doctor: currentDoctor.name || "Médico Hospital Sabará",
          notes: diagnosis,
          prescription: prescription,
          observation: observation,
          measurements: measurements
        });
        
        // Add notification to current user
        const notifications = currentUser.notifications || [];
        notifications.unshift({
          id: Date.now(),
          date: new Date().toISOString(),
          title: "Prescrição médica disponível",
          message: "Uma nova prescrição médica está disponível para você no seu histórico.",
          read: false
        });
        
        sessionStorage.setItem('currentUser', JSON.stringify({
          ...currentUser,
          medicalHistory,
          notifications
        }));
      }
    }
  };

  return {
    handleSavePrescription
  };
};
