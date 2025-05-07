
import { useState } from 'react';
import { useTriageActions } from '@/hooks/useTriageActions';

export const useUTIManagement = () => {
  const [isUtiDialogOpen, setIsUtiDialogOpen] = useState(false);
  const [selectedTriageId, setSelectedTriageId] = useState<number | null>(null);
  const { assignToUTI } = useTriageActions();
  
  // Handle opening the UTI dialog
  const handleAssignUTI = (triageId: number) => {
    setSelectedTriageId(triageId);
    setIsUtiDialogOpen(true);
  };
  
  // Handle UTI bed assignment
  const handleUTIAssignment = (triageId: number, bedId: string) => {
    assignToUTI.mutate({ triageId, bedId });
    setIsUtiDialogOpen(false);
  };

  // Close UTI dialog
  const handleCloseUTIDialog = () => {
    setIsUtiDialogOpen(false);
  };

  return {
    isUtiDialogOpen,
    selectedTriageId,
    handleAssignUTI,
    handleUTIAssignment,
    handleCloseUTIDialog
  };
};
