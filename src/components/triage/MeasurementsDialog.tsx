
import React from 'react';
import PhysicalTriageDialog from './PhysicalTriageDialog';
import { TriageEntry, TriageMeasurements } from '@/types/triage';
import { useIsMobile } from '@/hooks/use-mobile';

interface MeasurementsDialogProps {
  triage: TriageEntry | null;
  open: boolean;
  onClose: () => void;
  onSave: (triageId: number, measurements: TriageMeasurements, notes: string) => void;
  onComplete: (triageId: number) => void;
}

const MeasurementsDialog: React.FC<MeasurementsDialogProps> = (props) => {
  const isMobile = useIsMobile();
  
  return (
    <PhysicalTriageDialog 
      {...props}
      isMobile={isMobile}
    />
  );
};

export default MeasurementsDialog;
