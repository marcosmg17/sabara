
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListCheck } from 'lucide-react';
import { useTriageQueue } from '@/hooks/useTriageQueue';
import { useTriageActions } from '@/hooks/useTriageActions';
import TriageTableRow from './triage/TriageTableRow';
import MeasurementsDialog from './triage/MeasurementsDialog';
import UTIDialog from './triage/UTIDialog';
import { TriageEntry } from '@/types/triage';
import { useIsMobile } from '@/hooks/use-mobile';

const StaffTriageQueue = () => {
  const { triageQueue, isLoading } = useTriageQueue();
  const { assignDoctor, assignNurse, updateTriageMeasurements, completeNurseTriage, assignToUTI, removeTriage } = useTriageActions();
  const isMobile = useIsMobile();
  const [selectedTriage, setSelectedTriage] = useState<TriageEntry | null>(null);
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(false);
  const [isUtiDialogOpen, setIsUtiDialogOpen] = useState(false);
  const [selectedTriageId, setSelectedTriageId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('staff');

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'staff';
    setUserRole(role);
  }, []);

  const handleMeasurementsClick = (triage: TriageEntry) => {
    setSelectedTriage(triage);
    setIsMeasurementsOpen(true);
  };

  const handleMeasurementsSave = (triageId: number, measurements: any, notes: string) => {
    updateTriageMeasurements.mutate({ 
      triageId, 
      measurements,
      notes
    });
  };

  const handleCompleteNurseTriage = (triageId: number) => {
    completeNurseTriage.mutate({ triageId });
  };

  const handleAssignUTI = (triageId: number) => {
    setSelectedTriageId(triageId);
    setIsUtiDialogOpen(true);
  };

  const handleUTIAssign = (triageId: number, bedId: string) => {
    assignToUTI.mutate({ triageId, bedId });
  };

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
                <TableHead>Atendente</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {triageQueue.map((triage) => (
                <TriageTableRow
                  key={triage.id}
                  triage={triage}
                  onAssignDoctor={(triageId) => assignDoctor.mutate({ triageId })}
                  onAssignNurse={(triageId) => assignNurse.mutate({ triageId })}
                  onMeasurementsClick={handleMeasurementsClick}
                  onAssignUTI={handleAssignUTI}
                  onRemoveTriage={(triageId) => removeTriage.mutate(triageId)}
                  isMobile={isMobile}
                  userRole={userRole}
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
        
        <MeasurementsDialog
          triage={selectedTriage}
          open={isMeasurementsOpen}
          onClose={() => setIsMeasurementsOpen(false)}
          onSave={handleMeasurementsSave}
          onComplete={handleCompleteNurseTriage}
        />
        
        <UTIDialog
          triageId={selectedTriageId}
          open={isUtiDialogOpen}
          onClose={() => setIsUtiDialogOpen(false)}
          onAssign={handleUTIAssign}
        />
      </CardContent>
    </Card>
  );
};

export default StaffTriageQueue;
