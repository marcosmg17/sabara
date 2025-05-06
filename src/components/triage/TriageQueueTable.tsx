
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TriageTableRow from './TriageTableRow';
import { TriageEntry } from '@/types/triage';

interface TriageQueueTableProps {
  triageQueue: TriageEntry[];
  onAssignDoctor: (triageId: number) => void;
  onAssignNurse: (triageId: number) => void;
  onMeasurementsClick: (triage: TriageEntry) => void;
  onAssignUTI: (triageId: number) => void;
  onRemoveTriage: (triageId: number) => void;
  onSendToDoctor: (triage: TriageEntry) => void;
  isMobile: boolean;
  userRole: string;
}

const TriageQueueTable: React.FC<TriageQueueTableProps> = ({
  triageQueue,
  onAssignDoctor,
  onAssignNurse,
  onMeasurementsClick,
  onAssignUTI,
  onRemoveTriage,
  onSendToDoctor,
  isMobile,
  userRole,
}) => {
  return (
    <div className="min-w-[800px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Nome</TableHead>
            {!isMobile && (
              <>
                <TableHead>Idade</TableHead>
                <TableHead>Sexo</TableHead>
              </>
            )}
            <TableHead>Sintomas</TableHead>
            <TableHead>Atendente</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {triageQueue.map((triage) => (
            <TriageTableRow
              key={triage.id}
              triage={triage}
              onAssignDoctor={onAssignDoctor}
              onAssignNurse={onAssignNurse}
              onMeasurementsClick={onMeasurementsClick}
              onAssignUTI={onAssignUTI}
              onRemoveTriage={onRemoveTriage}
              onSendToDoctor={userRole === 'nurse' ? onSendToDoctor : undefined}
              isMobile={isMobile}
              userRole={userRole}
            />
          ))}
        </TableBody>
      </Table>
      
      {triageQueue.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Não há pacientes na fila de triagem
        </div>
      )}
    </div>
  );
};

export default TriageQueueTable;
