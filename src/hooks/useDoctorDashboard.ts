
import { useState } from 'react';
import { useDoctorData } from '@/hooks/useDoctorData';
import { usePatientConsultation } from '@/hooks/usePatientConsultation';
import { usePrescriptionDialogState } from '@/hooks/usePrescriptionDialogState';
import { useConsultationManagement } from '@/hooks/useConsultationManagement';
import { usePrescriptionManagement } from '@/hooks/usePrescriptionManagement';
import { useUTIManagement } from '@/hooks/useUTIManagement';
import { useTriagePolling } from '@/hooks/useTriagePolling';
import { TriageEntry } from '@/types/triage';

export const useDoctorDashboard = () => {
  // Get current doctor from localStorage
  const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');
  const selectedDoctorId = currentDoctor.id ? currentDoctor.id.toString() : '';
  
  // Get doctor data and related functions
  const {
    selectedDoctor,
    assignedPatients
  } = useDoctorData(selectedDoctorId);

  // Get prescription dialog state
  const {
    selectedTriage,
    isPrescriptionOpen,
    handleOpenPrescription,
    handleClosePrescriptionDialog
  } = usePrescriptionDialogState();

  // Get consultation management functions
  const { handleStartConsultation } = useConsultationManagement();
  
  // Get prescription management functions
  const { handleSavePrescription } = usePrescriptionManagement();
  
  // Get UTI management functions
  const {
    isUtiDialogOpen,
    selectedTriageId,
    handleAssignUTI,
    handleUTIAssignment,
    handleCloseUTIDialog
  } = useUTIManagement();
  
  // Get polling functionality
  const { setupPolling } = useTriagePolling();
  
  // Get patient consultation completion function
  const { handleCompleteConsultation } = usePatientConsultation();

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
