
import { useState } from 'react';
import { TriageEntry } from '@/types/triage';

export const usePrescriptionDialogState = () => {
  const [selectedTriage, setSelectedTriage] = useState<TriageEntry | null>(null);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  
  // Handle opening the prescription dialog
  const handleOpenPrescription = (triage: TriageEntry) => {
    setSelectedTriage(triage);
    setIsPrescriptionOpen(true);
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
