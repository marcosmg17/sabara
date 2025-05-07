
import { useState } from 'react';
import { TriageEntry } from '@/types/triage';

export const usePrescriptionDialogState = () => {
  const [selectedTriage, setSelectedTriage] = useState<TriageEntry | null>(null);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  
  // Handle opening the prescription dialog
  const handleOpenPrescription = (triage: TriageEntry) => {
    setSelectedTriage(triage);
    setIsPrescriptionOpen(true);
    
    // Check if the patient is Ana and ensure it's updated
    if (triage.patientName.toLowerCase().includes('ana')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const anaPatient = users.find((user: any) => 
        user.name.toLowerCase().includes('ana')
      );
      
      if (anaPatient) {
        const triageHistory = anaPatient.triageHistory || [];
        const currentTriage = triageHistory.find((t: any) => t.id === triage.id);
        
        if (!currentTriage) {
          // Add this triage to Ana's history if not already there
          triageHistory.unshift({
            id: triage.id,
            date: triage.date,
            symptoms: triage.symptoms,
            priority: triage.priority,
            recommendation: "Em atendimento médico",
            preTriageNotes: triage.preTriageNotes,
            nurseNotes: triage.nurseNotes
          });
          
          // Update Ana in the users list
          const updatedUsers = users.map((user: any) => {
            if (user.id === anaPatient.id) {
              return { ...user, triageHistory };
            }
            return user;
          });
          
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          
          // Update current user if it's Ana
          const currentUserStr = sessionStorage.getItem('currentUser');
          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            if (currentUser.id === anaPatient.id) {
              sessionStorage.setItem('currentUser', JSON.stringify({
                ...currentUser,
                triageHistory
              }));
            }
          }
        }
      }
    }
  };

  // Close prescription dialog
  const handleClosePrescriptionDialog = () => {
    setIsPrescriptionOpen(false);
  };

  return {
    selectedTriage,
    isPrescriptionOpen,
    handleOpenPrescription,
    handleClosePrescriptionDialog,
    setSelectedTriage
  };
};
