
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, ArrowRight, Loader2 } from 'lucide-react';

interface TriageDialogFooterProps {
  onSave: () => void;
  onComplete?: () => void;
  hasMeasurements: boolean;
  isCompleting?: boolean;
  completeBtnText?: string;
}

const TriageDialogFooter: React.FC<TriageDialogFooterProps> = ({
  onSave,
  onComplete,
  hasMeasurements,
  isCompleting = false,
  completeBtnText = "Concluir Triagem"
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onSave}
        className="order-1 sm:order-none"
      >
        <Save className="mr-2 h-4 w-4" />
        Salvar
      </Button>
      
      {onComplete && (
        <Button
          type="button"
          onClick={onComplete}
          disabled={!hasMeasurements || isCompleting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isCompleting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          {completeBtnText}
        </Button>
      )}
    </div>
  );
};

export default TriageDialogFooter;
