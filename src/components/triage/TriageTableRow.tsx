
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, Stethoscope, SquarePen, HeartPulse, 
  FileText, AlertCircle
} from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { TriageEntry } from '@/types/triage';
import { priorityColors, statusColors, statusLabels } from '@/hooks/useTriageQueue';

interface TriageTableRowProps {
  triage: TriageEntry;
  onAssignDoctor: (triageId: number) => void;
  onAssignNurse: (triageId: number) => void;
  onMeasurementsClick: (triage: TriageEntry) => void;
  onAssignUTI: (triageId: number) => void;
  onRemoveTriage: (triageId: number) => void;
  isMobile: boolean;
  userRole: string;
}

const TriageTableRow: React.FC<TriageTableRowProps> = ({
  triage,
  onAssignDoctor,
  onAssignNurse,
  onMeasurementsClick,
  onAssignUTI,
  onRemoveTriage,
  isMobile,
  userRole
}) => {
  // Function to determine if measurements exist
  const hasMeasurements = () => {
    if (!triage.measurements) return false;
    
    return Boolean(
      triage.measurements.temperature ||
      triage.measurements.heartRate ||
      triage.measurements.bloodPressure ||
      triage.measurements.oxygenSaturation ||
      triage.measurements.glucoseLevel
    );
  };

  const hasNurseMeasured = hasMeasurements();
  
  // Handle row click to open measurements dialog
  const handleRowClick = () => {
    if (userRole === 'nurse' && triage.status === 'nurse-triage' && triage.assignedNurse) {
      onMeasurementsClick(triage);
    } else if (userRole === 'nurse' && triage.status === 'waiting') {
      onAssignNurse(triage.id);
    }
  };

  // Handle nurse triage button click
  const handleNurseTriageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (triage.status === 'waiting') {
      onAssignNurse(triage.id);
    } else if (triage.status === 'nurse-triage') {
      onMeasurementsClick(triage);
    }
  };
  
  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50" 
      onClick={handleRowClick}
    >
      <TableCell>
        <Badge className={statusColors[triage.status]}>
          {statusLabels[triage.status]}
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
      <TableCell onClick={(e) => e.stopPropagation()}>
        {triage.status === 'waiting' && userRole === 'nurse' && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleNurseTriageClick}
            className="w-full flex items-center gap-2"
          >
            <Stethoscope className="h-4 w-4" />
            Realizar triagem física
          </Button>
        )}
        {triage.status === 'nurse-triage' && userRole === 'nurse' && (
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
            <Button
              size="sm"
              variant="outline"
              onClick={handleNurseTriageClick}
              className="w-full flex items-center gap-2"
              disabled={!triage.assignedNurse}
            >
              {hasNurseMeasured ? (
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
          </div>
        )}
        {triage.status === 'waiting' && userRole !== 'nurse' && (
          <div className="text-amber-500 flex items-center gap-1 text-sm">
            <AlertCircle className="h-4 w-4" />
            Aguardando triagem de enfermagem
          </div>
        )}
        {(triage.status === 'assigned' || triage.status === 'in-progress') && triage.assignedDoctor && (
          <div className="text-sm">
            <div className="font-medium">{triage.assignedDoctor.name}</div>
            <div className="text-gray-500">Sala {triage.assignedDoctor.room}</div>
          </div>
        )}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-2">
          {userRole === 'doctor' && hasNurseMeasured && triage.status === 'waiting' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAssignDoctor(triage.id)}
              className="w-full"
            >
              Atender paciente
            </Button>
          )}
          
          {userRole === 'doctor' && (triage.status === 'assigned' || triage.status === 'in-progress') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAssignUTI(triage.id)}
              className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50"
            >
              <SquarePen className="h-4 w-4" />
              UTI
            </Button>
          )}
          
          {(userRole === 'doctor' || userRole === 'staff') && (
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => onRemoveTriage(triage.id)}
            >
              <Check className="h-4 w-4" />
              Concluir
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TriageTableRow;
