
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TriageEntry, TriageMeasurements } from '@/types/triage';
import TriagePatientInfo from './TriagePatientInfo';
import TriageMeasurementFields from './TriageMeasurementFields';
import TriageDialogFooter from './TriageDialogFooter';

interface MeasurementsDialogProps {
  triage: TriageEntry | null;
  open: boolean;
  onClose: () => void;
  onSave: (triageId: number, measurements: TriageMeasurements, notes: string) => void;
  onComplete: (triageId: number) => void;
}

const MeasurementsDialog: React.FC<MeasurementsDialogProps> = ({
  triage,
  open,
  onClose,
  onSave,
  onComplete
}) => {
  const [measurements, setMeasurements] = useState<TriageMeasurements>({});
  const [notes, setNotes] = useState<string>('');
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (triage && open) {
      setMeasurements(triage.measurements || {});
      setNotes(triage.nurseNotes || '');
    } else {
      setMeasurements({});
      setNotes('');
    }
    setIsCompleting(false);
  }, [triage, open]);

  const handleSave = () => {
    if (triage) {
      onSave(triage.id, measurements, notes);
    }
  };

  const handleComplete = () => {
    if (triage) {
      setIsCompleting(true);
      
      // Primeiro salvamos as medições atualizadas
      onSave(triage.id, measurements, notes);
      
      // Depois concluímos a triagem e enviamos para o médico
      setTimeout(() => {
        onComplete(triage.id);
      }, 300);
    }
  };

  if (!triage) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Triagem de Enfermagem</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <TriagePatientInfo triage={triage} />
          
          <TriageMeasurementFields 
            measurements={measurements}
            setMeasurements={setMeasurements}
            notes={notes}
            setNotes={setNotes}
          />
          
          <TriageDialogFooter 
            onSave={handleSave}
            onComplete={handleComplete}
            hasMeasurements={
              Boolean(
                measurements.temperature || 
                measurements.heartRate || 
                measurements.bloodPressure || 
                measurements.oxygenSaturation
              )
            }
            isCompleting={isCompleting}
            completeBtnText="Concluir e Enviar para Médico"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementsDialog;
