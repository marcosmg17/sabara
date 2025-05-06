
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
  const [measurements, setMeasurements] = useState<{
    temperature: string;
    heartRate: string;
    bloodPressure: string;
    oxygenSaturation: string;
    glucoseLevel: string;
  }>({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    oxygenSaturation: '',
    glucoseLevel: ''
  });
  const [notes, setNotes] = useState<string>('');
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (triage && open) {
      setMeasurements({
        temperature: triage.measurements?.temperature?.toString() || '',
        heartRate: triage.measurements?.heartRate?.toString() || '',
        bloodPressure: triage.measurements?.bloodPressure || '',
        oxygenSaturation: triage.measurements?.oxygenSaturation?.toString() || '',
        glucoseLevel: triage.measurements?.glucoseLevel?.toString() || '',
      });
      setNotes(triage.nurseNotes || '');
    } else {
      setMeasurements({
        temperature: '',
        heartRate: '',
        bloodPressure: '',
        oxygenSaturation: '',
        glucoseLevel: ''
      });
      setNotes('');
    }
    setIsCompleting(false);
  }, [triage, open]);

  const handleSave = () => {
    if (triage) {
      // Convert string values to appropriate types for TriageMeasurements
      const triageMeasurements: TriageMeasurements = {
        temperature: measurements.temperature ? parseFloat(measurements.temperature) : undefined,
        heartRate: measurements.heartRate ? parseInt(measurements.heartRate) : undefined,
        bloodPressure: measurements.bloodPressure || undefined,
        oxygenSaturation: measurements.oxygenSaturation ? parseInt(measurements.oxygenSaturation) : undefined,
        glucoseLevel: measurements.glucoseLevel ? parseInt(measurements.glucoseLevel) : undefined
      };
      
      onSave(triage.id, triageMeasurements, notes);
    }
  };

  const handleComplete = () => {
    if (triage) {
      setIsCompleting(true);
      
      // Primeiro salvamos as medições atualizadas
      const triageMeasurements: TriageMeasurements = {
        temperature: measurements.temperature ? parseFloat(measurements.temperature) : undefined,
        heartRate: measurements.heartRate ? parseInt(measurements.heartRate) : undefined,
        bloodPressure: measurements.bloodPressure || undefined,
        oxygenSaturation: measurements.oxygenSaturation ? parseInt(measurements.oxygenSaturation) : undefined,
        glucoseLevel: measurements.glucoseLevel ? parseInt(measurements.glucoseLevel) : undefined
      };
      
      onSave(triage.id, triageMeasurements, notes);
      
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
            onMeasurementChange={(field, value) => 
              setMeasurements(prev => ({ ...prev, [field]: value }))
            }
            notes={notes}
            onNotesChange={setNotes}
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
