import { useState } from 'react';
import { useTriageQueue } from '@/hooks/useTriageQueue';
import { useTriageActions } from '@/hooks/useTriageActions';
import { TriageEntry } from '@/types/triage';
import { useToast } from '@/hooks/use-toast';

export const useTriageQueueHandlers = () => {
  const { triageQueue, isLoading } = useTriageQueue();
  const { toast } = useToast();
  const { 
    assignDoctor, 
    assignNurse, 
    updateTriageMeasurements, 
    completeNurseTriage, 
    assignToUTI, 
    removeTriage,
    sendToDoctor 
  } = useTriageActions();
  
  const [selectedTriage, setSelectedTriage] = useState<TriageEntry | null>(null);
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(false);
  const [isUtiDialogOpen, setIsUtiDialogOpen] = useState(false);
  const [selectedTriageId, setSelectedTriageId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('staff');

  const loadUserRole = () => {
    const role = localStorage.getItem('userRole') || 'staff';
    setUserRole(role);
    console.log("Current user role:", role);
    return role;
  };

  const handleMeasurementsClick = (triage: TriageEntry) => {
    console.log("Opening measurements dialog for patient:", triage.patientName);
    setSelectedTriage(triage);
    setIsMeasurementsOpen(true);
  };

  const handleMeasurementsSave = (triageId: number, measurements: any, notes: string) => {
    console.log("Saving measurements for triage ID:", triageId);
    updateTriageMeasurements.mutate({ 
      triageId, 
      measurements,
      notes
    });
  };

  const handleCompleteNurseTriage = (triageId: number) => {
    console.log("Completing nurse triage for ID:", triageId);
    
    // Usando sendToDoctor ao invés de completeNurseTriage
    sendToDoctor.mutate({ triageId });
    setIsMeasurementsOpen(false);
    
    toast({
      title: "Triagem de enfermagem concluída",
      description: "O paciente foi encaminhado para atendimento médico",
    });
  };
  
  const handleSendToDoctor = (triage: TriageEntry) => {
    console.log("Sending patient to doctor:", triage.patientName);
    
    sendToDoctor.mutate({ 
      triageId: triage.id
    }, {
      onSuccess: () => {
        if (isMeasurementsOpen) {
          setIsMeasurementsOpen(false);
        }
      }
    });
  };

  const handleAssignNurse = (triageId: number) => {
    console.log("Assigning nurse for triage ID:", triageId);
    // Find the triage entry with this ID
    const triage = triageQueue.find(t => t.id === triageId);
    if (!triage) {
      console.error("Triage not found with ID:", triageId);
      return;
    }
    
    // Start assigning a nurse
    assignNurse.mutate({ triageId }, {
      onSuccess: (data) => {
        console.log("Successfully assigned nurse:", data);
        if (data?.triage) {
          const triageWithCorrectStatus: TriageEntry = {
            ...data.triage,
            status: "nurse-triage" // Ensure we use the literal string type
          };
          setSelectedTriage(triageWithCorrectStatus);
          setIsMeasurementsOpen(true);
        }
      },
      onError: (error) => {
        console.error("Error assigning nurse:", error);
      }
    });
  };

  const handleAssignDoctor = (triageId: number) => {
    // Check if nurse triage was completed
    const triage = triageQueue.find(t => t.id === triageId);
    
    if (triage && !triage.measurements?.temperature && !triage.measurements?.heartRate) {
      toast({
        title: "Triagem de enfermagem necessária",
        description: "Este paciente precisa passar pela triagem de enfermagem antes de ser atendido por um médico.",
        variant: "destructive"
      });
      return;
    }
    
    assignDoctor.mutate({ triageId });
  };

  const handleAssignUTI = (triageId: number) => {
    setSelectedTriageId(triageId);
    setIsUtiDialogOpen(true);
  };

  const handleUTIAssign = (triageId: number, bedId: string) => {
    assignToUTI.mutate({ triageId, bedId });
    setIsUtiDialogOpen(false);
  };
  
  const closeUTIDialog = () => {
    setIsUtiDialogOpen(false);
  };
  
  const closeMeasurementsDialog = () => {
    setIsMeasurementsOpen(false);
  };

  return {
    triageQueue,
    isLoading,
    selectedTriage,
    isMeasurementsOpen,
    isUtiDialogOpen,
    selectedTriageId,
    userRole,
    loadUserRole,
    handleMeasurementsClick,
    handleMeasurementsSave,
    handleCompleteNurseTriage,
    handleSendToDoctor,
    handleAssignNurse,
    handleAssignDoctor,
    handleAssignUTI,
    handleUTIAssign,
    closeUTIDialog,
    closeMeasurementsDialog
  };
};
