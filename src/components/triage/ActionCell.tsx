
import React from 'react';
import { Button } from '@/components/ui/button';
import { TriageEntry } from '@/types/triage';
import { Check, Hospital } from 'lucide-react';

interface ActionCellProps {
  triage: TriageEntry;
  userRole: string;
  hasNurseMeasured: boolean;
  onAssignDoctor: () => void;
  onAssignUTI: () => void;
  onRemoveTriage: () => void;
}

const ActionCell: React.FC<ActionCellProps> = ({
  triage,
  userRole,
  hasNurseMeasured,
  onAssignDoctor,
  onAssignUTI,
  onRemoveTriage
}) => {
  return (
    <div className="flex flex-col gap-2">
      {userRole === 'doctor' && hasNurseMeasured && triage.status === 'waiting' && (
        <Button
          size="sm"
          variant="outline"
          onClick={onAssignDoctor}
          className="w-full"
        >
          Atender paciente
        </Button>
      )}
      
      {/* Mostra o botão de UTI para médicos e funcionários quando o paciente está atribuído ou em andamento */}
      {(userRole === 'doctor' || userRole === 'staff') && 
       (triage.status === 'assigned' || triage.status === 'in-progress') && (
        <Button
          size="sm"
          variant="outline"
          onClick={onAssignUTI}
          className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50"
        >
          <Hospital className="h-4 w-4" />
          UTI
        </Button>
      )}
      
      {/* Mostra informação da sala se atribuída */}
      {triage.assignedRoom && (
        <div className="text-xs font-medium text-gray-500 text-center">
          {triage.assignedRoom}
        </div>
      )}
      
      {(userRole === 'doctor' || userRole === 'staff') && (
        <Button
          size="sm"
          variant="ghost"
          className="flex items-center gap-2"
          onClick={onRemoveTriage}
        >
          <Check className="h-4 w-4" />
          Concluir
        </Button>
      )}
    </div>
  );
};

export default ActionCell;
