
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { TriageEntry } from '@/types/triage';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePrescriptionDialog } from '@/hooks/usePrescriptionDialog';
import PatientInfoDisplay from './prescription/PatientInfoDisplay';
import PrescriptionForm from './prescription/PrescriptionForm';
import PrescriptionActions from './prescription/PrescriptionActions';

interface PrescriptionDialogProps {
  triage: TriageEntry | null;
  open: boolean;
  onClose: () => void;
  onSave: (triageId: number, diagnosis: string, prescription: string, observation?: string) => void;
  onComplete: (triageId: number) => void;
  onPrint?: (triageId: number, diagnosis: string, prescription: string, observation?: string) => void;
  onAssignUTI?: (triageId: number) => void;
}

const PrescriptionDialog: React.FC<PrescriptionDialogProps> = ({
  triage,
  open,
  onClose,
  onSave,
  onComplete,
  onPrint,
  onAssignUTI
}) => {
  const isMobile = useIsMobile();
  const {
    diagnosis,
    setDiagnosis,
    prescription,
    setPrescription,
    observation,
    setObservation,
    saving,
    setSaving
  } = usePrescriptionDialog(triage);

  const handleSave = () => {
    if (!triage) return;
    setSaving(true);
    onSave(triage.id, diagnosis, prescription, observation);
    setSaving(false);
  };

  const handlePrint = () => {
    if (!triage || !onPrint) return;
    onPrint(triage.id, diagnosis, prescription, observation);
  };

  const handleComplete = () => {
    if (!triage) return;
    onComplete(triage.id);
    onClose();
  };
  
  const handleAssignUTI = () => {
    if (!triage || !onAssignUTI) return;
    onAssignUTI(triage.id);
  };

  const renderContent = () => (
    <div className="grid gap-4 py-4">
      <PatientInfoDisplay triage={triage} />
      <PrescriptionForm
        diagnosis={diagnosis}
        setDiagnosis={setDiagnosis}
        prescription={prescription}
        setPrescription={setPrescription}
        observation={observation}
        setObservation={setObservation}
      />
    </div>
  );

  const renderFooter = () => (
    <PrescriptionActions
      onClose={onClose}
      onSave={handleSave}
      onComplete={handleComplete}
      onPrint={onPrint ? handlePrint : undefined}
      onAssignUTI={onAssignUTI ? handleAssignUTI : undefined}
      saving={saving}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Atendimento - {triage?.patientName}</SheetTitle>
          </SheetHeader>
          {renderContent()}
          <SheetFooter className="mt-4">
            {renderFooter()}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Atendimento de Paciente - {triage?.patientName}</DialogTitle>
        </DialogHeader>
        {renderContent()}
        <DialogFooter>
          {renderFooter()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionDialog;
