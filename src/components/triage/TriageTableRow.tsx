
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { TriageEntry } from '@/types/triage';
import { priorityColors } from '@/hooks/useTriageQueue';

interface TriageTableRowProps {
  triage: TriageEntry;
  onAssignDoctor: (triageId: number) => void;
  onRemoveTriage: (triageId: number) => void;
  isMobile: boolean;
}

const TriageTableRow: React.FC<TriageTableRowProps> = ({
  triage,
  onAssignDoctor,
  onRemoveTriage,
  isMobile
}) => {
  return (
    <TableRow>
      <TableCell>
        <Badge className={
          triage.status === 'waiting' ? 'bg-blue-500' : 
          triage.status === 'assigned' ? 'bg-purple-500' : 
          triage.status === 'in-progress' ? 'bg-amber-500' : 
          'bg-gray-500'
        }>
          {triage.status === 'waiting' ? 'Aguardando' : 
           triage.status === 'assigned' ? 'Atribuído' : 
           triage.status === 'in-progress' ? 'Em atendimento' : 
           'Concluído'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={priorityColors[triage.priority]}>
          {triage.priority}
        </Badge>
      </TableCell>
      <TableCell>{triage.patientName}</TableCell>
      {!isMobile && (
        <>
          <TableCell>{triage.patientAge}</TableCell>
          <TableCell>{triage.patientGender}</TableCell>
        </>
      )}
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {triage.symptoms.map((symptom, index) => (
            <Badge key={index} variant="outline">{symptom}</Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        {triage.assignedDoctor ? (
          <div className="text-sm">
            <div className="font-medium">{triage.assignedDoctor.name}</div>
            <div className="text-gray-500">Sala {triage.assignedDoctor.room}</div>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAssignDoctor(triage.id)}
            className="w-full"
          >
            Atribuir ao próximo médico disponível
          </Button>
        )}
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => onRemoveTriage(triage.id)}
        >
          <Check className="h-4 w-4" />
          Concluir
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TriageTableRow;
