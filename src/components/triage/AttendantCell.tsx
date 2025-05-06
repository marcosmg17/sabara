
import React from 'react';
import { Button } from '@/components/ui/button';
import { TriageEntry } from '@/types/triage';
import { ArrowRight, FileText, HeartPulse, Stethoscope, AlertCircle } from 'lucide-react';

interface AttendantCellProps {
  triage: TriageEntry;
  userRole: string;
  onNurseTriageClick: (e: React.MouseEvent) => void;
  onSendToDoctorClick?: (e: React.MouseEvent) => void;
  hasMeasurements: boolean;
}

const AttendantCell: React.FC<AttendantCellProps> = ({
  triage,
  userRole,
  onNurseTriageClick,
  onSendToDoctorClick,
  hasMeasurements
}) => {
  if (triage.status === 'waiting' && userRole === 'nurse') {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={onNurseTriageClick}
        className="w-full flex items-center gap-2"
      >
        <Stethoscope className="h-4 w-4" />
        Realizar triagem física
      </Button>
    );
  }
  
  if (triage.status === 'nurse-triage' && userRole === 'nurse') {
    return (
      <div className="space-y-2">
        <div className="text-sm">
          {triage.assignedNurse ? (
            <>
              <div className="font-medium">{triage.assignedNurse.name}</div>
              {triage.assignedNurse.room && (
                <div className="text-gray-500">Sala {triage.assignedNurse.room}</div>
              )}
            </>
          ) : (
            <div className="text-amber-500 font-medium">Enfermeiro(a) não atribuído</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onNurseTriageClick}
            className="w-full flex items-center gap-2"
            disabled={!triage.assignedNurse}
          >
            {hasMeasurements ? (
              <>
                <FileText className="h-4 w-4" />
                Editar triagem
              </>
            ) : (
              <>
                <HeartPulse className="h-4 w-4" />
                Realizar triagem
              </>
            )}
          </Button>
          
          {hasMeasurements && onSendToDoctorClick && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onSendToDoctorClick}
              className="w-full flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Encaminhar para atendimento
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  if (triage.status === 'waiting' && userRole !== 'nurse') {
    return (
      <div className="text-amber-500 flex items-center gap-1 text-sm">
        <AlertCircle className="h-4 w-4" />
        Aguardando triagem de enfermagem
      </div>
    );
  }
  
  if ((triage.status === 'assigned' || triage.status === 'in-progress') && triage.assignedDoctor) {
    return (
      <div className="text-sm">
        <div className="font-medium">{triage.assignedDoctor.name}</div>
        <div className="text-gray-500">Sala {triage.assignedDoctor.room}</div>
      </div>
    );
  }
  
  return null;
};

export default AttendantCell;
