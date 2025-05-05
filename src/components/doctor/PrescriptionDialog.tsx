
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TriageEntry } from '@/types/triage';

interface PrescriptionDialogProps {
  triage: TriageEntry | null;
  open: boolean;
  onClose: () => void;
  onSave: (triageId: number, diagnosis: string, prescription: string) => void;
  onComplete: (triageId: number) => void;
}

const PrescriptionDialog: React.FC<PrescriptionDialogProps> = ({
  triage,
  open,
  onClose,
  onSave,
  onComplete
}) => {
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [prescription, setPrescription] = useState<string>('');

  useEffect(() => {
    if (triage) {
      setDiagnosis(triage.doctorDiagnosis || '');
      setPrescription(triage.prescription || '');
    }
  }, [triage]);

  const handleSave = () => {
    if (!triage) return;
    onSave(triage.id, diagnosis, prescription);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Atendimento de Paciente - {triage.patientName}</DialogTitle>
        </DialogHeader>
        
        {triage.measurements && (
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Medições do Paciente:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {triage.measurements.temperature && (
                <div><span className="font-medium">Temperatura:</span> {triage.measurements.temperature}°C</div>
              )}
              {triage.measurements.heartRate && (
                <div><span className="font-medium">Batimentos:</span> {triage.measurements.heartRate} BPM</div>
              )}
              {triage.measurements.bloodPressure && (
                <div><span className="font-medium">Pressão:</span> {triage.measurements.bloodPressure}</div>
              )}
              {triage.measurements.oxygenSaturation && (
                <div><span className="font-medium">Saturação O²:</span> {triage.measurements.oxygenSaturation}%</div>
              )}
              {triage.measurements.glucoseLevel && (
                <div><span className="font-medium">Glicemia:</span> {triage.measurements.glucoseLevel} mg/dL</div>
              )}
            </div>
            {triage.nurseNotes && (
              <div className="mt-2">
                <span className="font-medium">Observações da enfermagem:</span>
                <p className="text-sm mt-1">{triage.nurseNotes}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="diagnosis" className="text-sm font-medium">
              Diagnóstico
            </label>
            <Input
              id="diagnosis"
              placeholder="Insira o diagnóstico"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="prescription" className="text-sm font-medium">
              Prescrição Médica
            </label>
            <Textarea
              id="prescription"
              placeholder="Insira a prescrição médica..."
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              rows={8}
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
            Concluir Atendimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionDialog;
