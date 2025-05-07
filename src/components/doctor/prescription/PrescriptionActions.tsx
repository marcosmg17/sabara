
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, FileText, Printer, Save, Hospital } from 'lucide-react';

interface PrescriptionActionsProps {
  onClose: () => void;
  onSave: () => void;
  onComplete: () => void;
  onPrint?: () => void;
  onAssignUTI?: () => void;
  saving: boolean;
}

const PrescriptionActions: React.FC<PrescriptionActionsProps> = ({
  onClose,
  onSave,
  onComplete,
  onPrint,
  onAssignUTI,
  saving
}) => {
  return (
    <div className="flex justify-between w-full flex-col-reverse sm:flex-row gap-2">
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <div className="flex gap-2 flex-wrap justify-end">
        {onAssignUTI && (
          <Button 
            variant="outline" 
            onClick={onAssignUTI}
            className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50"
          >
            <Hospital className="h-4 w-4" />
            Encaminhar para UTI
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={onSave} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar
        </Button>
        {onPrint && (
          <Button 
            variant="outline" 
            onClick={onPrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        )}
        <Button 
          onClick={onComplete}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Concluir Atendimento
        </Button>
      </div>
    </div>
  );
};

export default PrescriptionActions;
