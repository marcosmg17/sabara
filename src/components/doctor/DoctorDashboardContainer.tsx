
import React from 'react';
import DoctorHeader from './DoctorHeader';
import PatientDashboard from './PatientDashboard';
import PrescriptionDialog from './PrescriptionDialog';
import UTIDialog from '../triage/UTIDialog';
import { useDoctorDashboard } from '@/hooks/useDoctorDashboard';
import { usePrescriptionPrinter } from './PrescriptionPrinter';
import { TriageEntry } from '@/types/triage';
import { useEffect } from 'react';

const DoctorDashboardContainer: React.FC = () => {
  const {
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
  } = useDoctorDashboard();
  
  const { printPrescription } = usePrescriptionPrinter();

  // Handle printing prescription
  const handlePrintPrescription = (triageId: number, diagnosis: string, prescription: string, observation?: string) => {
    const triage = assignedPatients.find(t => t.id === triageId);
    if (triage) {
      printPrescription(triageId, diagnosis, prescription, observation, triage);
    }
  };

  // Set up polling for triage queue updates
  useEffect(() => {
    const cleanupPolling = setupPolling();
    return cleanupPolling;
  }, []);

  return (
    <div className="space-y-6">
      <DoctorHeader title="Painel do Médico" />
      
      {selectedDoctor ? (
        <PatientDashboard
          doctor={selectedDoctor}
          assignedPatients={assignedPatients}
          onStartConsultation={handleStartConsultation}
          onPrescription={handleOpenPrescription}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          Não foi possível encontrar informações do médico logado
        </div>
      )}

      <PrescriptionDialog
        triage={selectedTriage}
        open={isPrescriptionOpen}
        onClose={handleClosePrescriptionDialog}
        onSave={handleSavePrescription}
        onComplete={handleCompleteConsultation}
        onPrint={handlePrintPrescription}
        onAssignUTI={handleAssignUTI}
      />
      
      <UTIDialog
        triageId={selectedTriageId}
        open={isUtiDialogOpen}
        onClose={handleCloseUTIDialog}
        onAssign={handleUTIAssignment}
      />
    </div>
  );
};

export default DoctorDashboardContainer;
