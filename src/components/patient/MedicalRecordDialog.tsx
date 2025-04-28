
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Patient } from '@/types/patient';

interface MedicalRecordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient;
  doctorName: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
}

const MedicalRecordDialog: React.FC<MedicalRecordDialogProps> = ({
  isOpen,
  onOpenChange,
  patient,
  doctorName,
  notes,
  onNotesChange,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar registro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo registro médico</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="patient-name">Paciente</Label>
            <div id="patient-name" className="font-medium">
              {patient?.name}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="doctor-name">Médico</Label>
            <div id="doctor-name" className="font-medium">
              {doctorName}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Anotações médicas</Label>
            <Textarea
              id="notes"
              placeholder="Digite as anotações médicas aqui..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            Salvar registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordDialog;
