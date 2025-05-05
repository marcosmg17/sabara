
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { TriageEntry, TriageMeasurements } from '@/types/triage';
import TriagePatientInfo from './TriagePatientInfo';
import TriageMeasurementFields from './TriageMeasurementFields';
import TriageDialogFooter from './TriageDialogFooter';

interface PhysicalTriageDialogProps {
  triage: TriageEntry | null;
  open: boolean;
  onClose: () => void;
  onSave: (triageId: number, measurements: TriageMeasurements, notes: string) => void;
  onComplete: (triageId: number) => void;
  isMobile?: boolean;
}

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
