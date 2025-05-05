
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { TriageEntry, TriageMeasurements } from '@/types/triage';
import { Check, FileText, Printer, Save } from 'lucide-react';

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
  const [temperature, setTemperature] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [oxygenSaturation, setOxygenSaturation] = useState<string>('');
  const [glucoseLevel, setGlucoseLevel] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

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
    setSaving(true);

    const measurements: TriageMeasurements = {
      temperature: temperature ? parseFloat(temperature) : undefined,
      heartRate: heartRate ? parseInt(heartRate) : undefined,
      bloodPressure: bloodPressure || undefined,
      oxygenSaturation: oxygenSaturation ? parseInt(oxygenSaturation) : undefined,
      glucoseLevel: glucoseLevel ? parseInt(glucoseLevel) : undefined
    };

    onSave(triage.id, measurements, notes);
    setSaving(false);
  };

  const handleComplete = () => {
    if (!triage) return;
    onComplete(triage.id);
    onClose();
  };

  const renderContent = () => (
    <div className="grid gap-4 py-4">
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
        <Button 
          onClick={handleComplete} 
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Concluir Triagem
        </Button>
      </div>
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
            {renderFooter()}
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
          {renderFooter()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhysicalTriageDialog;
