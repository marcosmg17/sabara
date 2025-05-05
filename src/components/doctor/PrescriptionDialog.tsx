
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { TriageEntry } from '@/types/triage';
import { Check, FileText, Printer, Save } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PrescriptionDialogProps {
  triage: TriageEntry | null;
  open: boolean;
  onClose: () => void;
  onSave: (triageId: number, diagnosis: string, prescription: string) => void;
  onComplete: (triageId: number) => void;
  onPrint?: (triageId: number, diagnosis: string, prescription: string) => void;
}

const PrescriptionDialog: React.FC<PrescriptionDialogProps> = ({
  triage,
  open,
  onClose,
  onSave,
  onComplete,
  onPrint
}) => {
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [prescription, setPrescription] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (triage) {
      setDiagnosis(triage.doctorDiagnosis || '');
      setPrescription(triage.prescription || '');
    }
  }, [triage]);

  const handleSave = () => {
    if (!triage) return;
    setSaving(true);
    onSave(triage.id, diagnosis, prescription);
    setSaving(false);
  };

  const handlePrint = () => {
    if (!triage || !onPrint) return;
    onPrint(triage.id, diagnosis, prescription);
  };

  const handleComplete = () => {
    if (!triage) return;
    onComplete(triage.id);
    onClose();
  };

  const renderContent = () => (
    <div className="grid gap-4 py-4">
      {triage?.measurements && (
        <div className="bg-green-50 p-4 rounded-md mb-2">
          <h3 className="text-sm font-medium text-green-800 mb-2">Triagem de Enfermagem</h3>
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
            <div className="mt-2 border-t border-green-200 pt-2">
              <span className="font-medium">Observações da enfermagem:</span>
              <p className="text-sm mt-1">{triage.nurseNotes}</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-md mb-2">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Informações do Paciente</h3>
        <p className="text-sm text-blue-700"><strong>Nome:</strong> {triage?.patientName}</p>
        <p className="text-sm text-blue-700"><strong>Idade:</strong> {triage?.patientAge} anos</p>
        <p className="text-sm text-blue-700"><strong>Gênero:</strong> {triage?.patientGender}</p>
        <div className="mt-1">
          <strong className="text-sm text-blue-700">Sintomas reportados:</strong>
          <div className="flex flex-wrap gap-1 mt-1">
            {triage?.symptoms.map((symptom, i) => (
              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {symptom}
              </span>
            ))}
          </div>
        </div>
      </div>
      
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
  );

  const renderFooter = () => (
    <div className="flex justify-between w-full">
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar
        </Button>
        {onPrint && (
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        )}
        <Button 
          onClick={handleComplete}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Concluir Atendimento
        </Button>
      </div>
    </div>
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
