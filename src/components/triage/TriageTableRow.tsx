
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { TriageEntry } from '@/types/triage';
import TriageStatus from './TriageStatus';
import PriorityBadge from './PriorityBadge';
import SymptomBadges from './SymptomBadges';
import AttendantCell from './AttendantCell';
import ActionCell from './ActionCell';
import { useTriageMeasurements } from '@/hooks/useTriageMeasurements';

interface TriageTableRowProps {
  triage: TriageEntry;
  onAssignDoctor: (triageId: number) => void;
  onAssignNurse: (triageId: number) => void;
  onMeasurementsClick: (triage: TriageEntry) => void;
  onAssignUTI: (triageId: number) => void;
  onRemoveTriage: (triageId: number) => void;
  onSendToDoctor?: (triage: TriageEntry) => void;
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
  onSendToDoctor,
  isMobile,
  userRole
}) => {
  const { hasMeasurements } = useTriageMeasurements();
  
  const hasNurseMeasured = hasMeasurements(triage.measurements);
  
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
    console.log("Nurse triage button clicked for patient:", triage.patientName);
    
    if (triage.status === 'waiting') {
      onAssignNurse(triage.id);
    } else if (triage.status === 'nurse-triage') {
      onMeasurementsClick(triage);
    }
  };

  // Handle send to doctor button click
  const handleSendToDoctorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSendToDoctor && triage.status === 'nurse-triage') {
      onSendToDoctor(triage);
    }
  };
  
  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50" 
      onClick={handleRowClick}
    >
      <TableCell>
        <TriageStatus status={triage.status} />
      </TableCell>
      <TableCell>
        <PriorityBadge priority={triage.priority} />
      </TableCell>
      <TableCell>{triage.patientName}</TableCell>
      
      {!isMobile && (
        <>
          <TableCell>{triage.patientAge}</TableCell>
          <TableCell>{triage.patientGender}</TableCell>
        </>
      )}
      
      <TableCell>
        <SymptomBadges symptoms={triage.symptoms} />
      </TableCell>
      
      <TableCell onClick={(e) => e.stopPropagation()}>
        <AttendantCell
          triage={triage}
          userRole={userRole}
          onNurseTriageClick={handleNurseTriageClick}
          onSendToDoctorClick={onSendToDoctor ? handleSendToDoctorClick : undefined}
          hasMeasurements={hasNurseMeasured}
        />
      </TableCell>
      
      <TableCell onClick={(e) => e.stopPropagation()}>
        <ActionCell
          triage={triage}
          userRole={userRole}
          hasNurseMeasured={hasNurseMeasured}
          onAssignDoctor={() => onAssignDoctor(triage.id)}
          onAssignUTI={() => onAssignUTI(triage.id)}
          onRemoveTriage={() => onRemoveTriage(triage.id)}
        />
      </TableCell>
    </TableRow>
  );
};

export default TriageTableRow;
