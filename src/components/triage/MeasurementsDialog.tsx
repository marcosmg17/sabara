
import React from 'react';
import PhysicalTriageDialog from './PhysicalTriageDialog';
import { TriageEntry, TriageMeasurements } from '@/types/triage';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface MeasurementsDialogProps {
  triage: TriageEntry | null;
  open: boolean;
  onClose: () => void;
  onSave: (triageId: number, measurements: TriageMeasurements, notes: string) => void;
  onComplete: (triageId: number) => void;
}

const MeasurementsDialog: React.FC<MeasurementsDialogProps> = (props) => {
  const { triage, open } = props;
  const isMobile = useIsMobile();
  
  // Check if nurse is assigned before showing dialog
  if (open && triage && !triage.assignedNurse) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Enfermeiro não atribuído</AlertTitle>
        <AlertDescription>
          Não há enfermeiro atribuído a esta triagem. Por favor, atribua um enfermeiro primeiro.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <PhysicalTriageDialog 
      {...props}
      isMobile={isMobile}
    />
  );
};

export default MeasurementsDialog;
