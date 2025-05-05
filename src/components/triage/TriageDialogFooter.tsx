
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Save } from 'lucide-react';

interface TriageDialogFooterProps {
  onCancel: () => void;
  onSave: () => void;
  onComplete: () => void;
  saving: boolean;
}

const TriageDialogFooter: React.FC<TriageDialogFooterProps> = ({
  onCancel,
  onSave,
  onComplete,
  saving
}) => {
  return (
    <div className="flex justify-between w-full">
      <Button variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar
        </Button>
        <Button 
          onClick={onComplete} 
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Concluir Triagem
        </Button>
      </div>
    </div>
  );
};

export default TriageDialogFooter;
