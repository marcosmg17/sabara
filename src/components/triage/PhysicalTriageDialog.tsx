
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { TriageEntry, TriageMeasurements } from '@/types/triage';
import TriagePatientInfo from './TriagePatientInfo';
import TriageMeasurementFields from './TriageMeasurementFields';
import TriageDialogFooter from './TriageDialogFooter';
import { useToast } from '@/hooks/use-toast';

interface PhysicalTriageDialogProps {
  triage: TriageEntry | null;
  open: boolean;
  onClose: () => void;
  onSave: (triageId: number, measurements: TriageMeasurements, notes: string) => void;
  onComplete: (triageId: number) => void;
  isMobile?: boolean;
}

// Validation function for measurements
const validateMeasurements = (measurements: {
  temperature: string;
  heartRate: string;
  bloodPressure: string;
  oxygenSaturation: string;
  glucoseLevel: string;
}) => {
  const errors: string[] = [];
  const { temperature, heartRate, bloodPressure, oxygenSaturation, glucoseLevel } = measurements;

  // Check temperature
  if (temperature) {
    const temp = parseFloat(temperature);
    if (isNaN(temp) || temp < 35 || temp > 42) {
      errors.push("Temperatura inválida");
    }
  }

  // Check heart rate
  if (heartRate) {
    const hr = parseFloat(heartRate);
    if (isNaN(hr) || hr < 40 || hr > 200) {
      errors.push("Batimentos cardíacos inválidos");
    }
  }

  // Check blood pressure
  if (bloodPressure) {
    const regex = /^(\d{2,3})\/(\d{2,3})$/;
    if (!regex.test(bloodPressure)) {
      errors.push("Formato de pressão arterial inválido");
    } else {
      const [systolic, diastolic] = bloodPressure.split('/').map(Number);
      if (systolic < 70 || systolic > 220 || diastolic < 40 || diastolic > 140) {
        errors.push("Valores de pressão arterial inválidos");
      }
    }
  }

  // Check oxygen saturation
  if (oxygenSaturation) {
    const ox = parseFloat(oxygenSaturation);
    if (isNaN(ox) || ox < 70 || ox > 100) {
      errors.push("Saturação de oxigênio inválida");
    }
  }

  // Check glucose level
  if (glucoseLevel) {
    const gl = parseFloat(glucoseLevel);
    if (isNaN(gl) || gl < 40 || gl > 500) {
      errors.push("Nível de glicose inválido");
    }
  }

  return errors;
};

const PhysicalTriageDialog: React.FC<PhysicalTriageDialogProps> = ({
  triage,
  open,
  onClose,
  onSave,
  onComplete,
  isMobile = false
}) => {
  const [measurements, setMeasurements] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    oxygenSaturation: '',
    glucoseLevel: ''
  });
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (triage) {
      setMeasurements({
        temperature: triage.measurements?.temperature?.toString() || '',
        heartRate: triage.measurements?.heartRate?.toString() || '',
        bloodPressure: triage.measurements?.bloodPressure || '',
        oxygenSaturation: triage.measurements?.oxygenSaturation?.toString() || '',
        glucoseLevel: triage.measurements?.glucoseLevel?.toString() || '',
      });
      setNotes(triage.nurseNotes || '');
    }
  }, [triage]);

  const handleMeasurementChange = (field: keyof TriageMeasurements, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!triage) return;
    
    // Validate measurements before saving
    const validationErrors = validateMeasurements(measurements);
    
    if (validationErrors.length > 0) {
      toast({
        title: "Dados inválidos",
        description: validationErrors.join(", "),
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);

    const triageMeasurements: TriageMeasurements = {
      temperature: measurements.temperature ? parseFloat(measurements.temperature) : undefined,
      heartRate: measurements.heartRate ? parseInt(measurements.heartRate) : undefined,
      bloodPressure: measurements.bloodPressure || undefined,
      oxygenSaturation: measurements.oxygenSaturation ? parseInt(measurements.oxygenSaturation) : undefined,
      glucoseLevel: measurements.glucoseLevel ? parseInt(measurements.glucoseLevel) : undefined
    };

    onSave(triage.id, triageMeasurements, notes);
    setSaving(false);
  };

  const handleComplete = () => {
    if (!triage) return;
    
    // Ensure we have at least some measurements before completing
    if (!measurements.temperature && !measurements.heartRate && !measurements.bloodPressure) {
      toast({
        title: "Dados incompletos",
        description: "É necessário preencher pelo menos um sinal vital antes de concluir a triagem.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate measurements that are filled
    const validationErrors = validateMeasurements(measurements);
    
    if (validationErrors.length > 0) {
      toast({
        title: "Dados inválidos",
        description: validationErrors.join(", "),
        variant: "destructive"
      });
      return;
    }
    
    onComplete(triage.id);
    onClose();
  };

  const renderContent = () => (
    <div className="grid gap-4 py-4">
      {triage && <TriagePatientInfo triage={triage} />}
      
      <TriageMeasurementFields
        measurements={measurements}
        notes={notes}
        onMeasurementChange={handleMeasurementChange}
        onNotesChange={setNotes}
      />
    </div>
  );

  if (!triage) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Triagem Física - {triage.patientName}</SheetTitle>
          </SheetHeader>
          {renderContent()}
          <SheetFooter className="mt-4">
            <TriageDialogFooter
              onCancel={onClose}
              onSave={handleSave}
              onComplete={handleComplete}
              saving={saving}
            />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Triagem Física - {triage.patientName}</DialogTitle>
        </DialogHeader>
        {renderContent()}
        <DialogFooter>
          <TriageDialogFooter
            onCancel={onClose}
            onSave={handleSave}
            onComplete={handleComplete}
            saving={saving}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhysicalTriageDialog;
