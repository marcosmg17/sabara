
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TriageEntry, TriageMeasurements } from '@/types/triage';

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
  const [temperature, setTemperature] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [oxygenSaturation, setOxygenSaturation] = useState<string>('');
  const [glucoseLevel, setGlucoseLevel] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (triage) {
      setTemperature(triage.measurements?.temperature?.toString() || '');
      setHeartRate(triage.measurements?.heartRate?.toString() || '');
      setBloodPressure(triage.measurements?.bloodPressure || '');
      setOxygenSaturation(triage.measurements?.oxygenSaturation?.toString() || '');
      setGlucoseLevel(triage.measurements?.glucoseLevel?.toString() || '');
      setNotes(triage.nurseNotes || '');
    }
  }, [triage]);

  const handleSave = () => {
    if (!triage) return;

    const measurements: TriageMeasurements = {
      temperature: temperature ? parseFloat(temperature) : undefined,
      heartRate: heartRate ? parseInt(heartRate) : undefined,
      bloodPressure: bloodPressure || undefined,
      oxygenSaturation: oxygenSaturation ? parseInt(oxygenSaturation) : undefined,
      glucoseLevel: glucoseLevel ? parseInt(glucoseLevel) : undefined
    };

    onSave(triage.id, measurements, notes);
    onClose();
  };

  const handleComplete = () => {
    if (!triage) return;
    onComplete(triage.id);
    onClose();
  };

  if (!triage) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Medições do Paciente - {triage.patientName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="temperature" className="text-sm font-medium">
                Temperatura (°C)
              </label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="Ex: 37.5"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="heartRate" className="text-sm font-medium">
                Batimentos Cardíacos (BPM)
              </label>
              <Input
                id="heartRate"
                type="number"
                placeholder="Ex: 80"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="bloodPressure" className="text-sm font-medium">
                Pressão Arterial
              </label>
              <Input
                id="bloodPressure"
                placeholder="Ex: 120/80"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="oxygenSaturation" className="text-sm font-medium">
                Saturação de O² (%)
              </label>
              <Input
                id="oxygenSaturation"
                type="number"
                min="0"
                max="100"
                placeholder="Ex: 98"
                value={oxygenSaturation}
                onChange={(e) => setOxygenSaturation(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="glucoseLevel" className="text-sm font-medium">
              Glicemia (mg/dL)
            </label>
            <Input
              id="glucoseLevel"
              type="number"
              placeholder="Ex: 100"
              value={glucoseLevel}
              onChange={(e) => setGlucoseLevel(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Observações da Enfermagem
            </label>
            <Textarea
              id="notes"
              placeholder="Insira suas observações aqui..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
          <Button variant="default" onClick={handleComplete}>
            Concluir Triagem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementsDialog;
