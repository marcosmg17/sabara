
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, ArrowRight, Loader2, X } from 'lucide-react';

interface TriageDialogFooterProps {
  onSave: () => void;
  onComplete?: () => void;
  hasMeasurements?: boolean;
  isCompleting?: boolean;
  completeBtnText?: string;
  onCancel?: () => void;
  saving?: boolean;
}

const TriageDialogFooter: React.FC<TriageDialogFooterProps> = ({
  onSave,
  onComplete,
  hasMeasurements = false,
  isCompleting = false,
  completeBtnText = "Concluir Triagem",
  onCancel,
  saving = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
      {onCancel && (
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="order-2 sm:order-none"
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      )}
      
      <Button
        type="button"
        variant="outline"
        onClick={onSave}
        disabled={saving}
        className="order-1 sm:order-none"
      >
        {saving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Salvar
      </Button>
      
      {onComplete && (
        <Button
          type="button"
          onClick={onComplete}
          disabled={!hasMeasurements || isCompleting || saving}
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
