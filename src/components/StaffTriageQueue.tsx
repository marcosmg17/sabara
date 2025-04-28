import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListCheck } from 'lucide-react';
import { useTriageQueue } from '@/hooks/useTriageQueue';
import { useTriageActions } from '@/hooks/useTriageActions';
import TriageTableRow from './triage/TriageTableRow';
import { useIsMobile } from '@/hooks/use-mobile';

const StaffTriageQueue = () => {
  const { triageQueue, isLoading } = useTriageQueue();
  const { assignDoctor, removeTriage } = useTriageActions();
  const isMobile = useIsMobile();

  // Auto-assign doctors to waiting patients
  useEffect(() => {
    const waitingPatients = triageQueue.filter(triage => triage.status === 'waiting');
    if (waitingPatients.length > 0) {
      waitingPatients.forEach(patient => {
        assignDoctor.mutate({ triageId: patient.id });
      });
    }
  }, [triageQueue]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <ListCheck className="h-5 w-5" />
          Fila de Triagem
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
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
                <TableHead>Médico</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {triageQueue.map((triage) => (
                <TriageTableRow
                  key={triage.id}
                  triage={triage}
                  onAssignDoctor={(triageId) => assignDoctor.mutate({ triageId })}
                  onRemoveTriage={(triageId) => removeTriage.mutate(triageId)}
                  isMobile={isMobile}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        {triageQueue.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Não há pacientes na fila de triagem
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffTriageQueue;
