
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import MeasurementsDialog from './triage/MeasurementsDialog';
import UTIDialog from './triage/UTIDialog';
import TriageQueueHeader from './triage/TriageQueueHeader';
import TriageQueueTable from './triage/TriageQueueTable';
import { useTriageQueueHandlers } from '@/hooks/useTriageQueueHandlers';
import { useTriageActions } from '@/hooks/useTriageActions';

const StaffTriageQueue = () => {
  const { removeTriage } = useTriageActions();
  const {
    triageQueue,
    isLoading,
    selectedTriage,
    isMeasurementsOpen,
    isUtiDialogOpen,
    selectedTriageId,
    userRole,
    loadUserRole,
    handleMeasurementsClick,
    handleMeasurementsSave,
    handleCompleteNurseTriage,
    handleSendToDoctor,
    handleAssignNurse,
    handleAssignDoctor,
    handleAssignUTI,
    handleUTIAssign,
    closeUTIDialog,
    closeMeasurementsDialog
  } = useTriageQueueHandlers();
  
  const isMobile = useIsMobile();

  useEffect(() => {
    loadUserRole();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="shadow-md">
      <TriageQueueHeader />
      <CardContent className="overflow-x-auto">
        <TriageQueueTable 
          triageQueue={triageQueue}
          onAssignDoctor={handleAssignDoctor}
          onAssignNurse={handleAssignNurse}
          onMeasurementsClick={handleMeasurementsClick}
          onAssignUTI={handleAssignUTI}
          onRemoveTriage={(triageId) => removeTriage.mutate(triageId)}
          onSendToDoctor={handleSendToDoctor}
          isMobile={isMobile}
          userRole={userRole}
        />
        
        <MeasurementsDialog
          triage={selectedTriage}
          open={isMeasurementsOpen}
          onClose={closeMeasurementsDialog}
          onSave={handleMeasurementsSave}
          onComplete={handleCompleteNurseTriage}
        />
        
        <UTIDialog
          triageId={selectedTriageId}
          open={isUtiDialogOpen}
          onClose={closeUTIDialog}
          onAssign={handleUTIAssign}
        />
      </CardContent>
    </Card>
  );
};

export default StaffTriageQueue;
