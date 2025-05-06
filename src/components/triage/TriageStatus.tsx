
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TriageEntry } from '@/types/triage';
import { statusColors, statusLabels } from '@/hooks/useTriageQueue';

interface TriageStatusProps {
  status: TriageEntry['status'];
}

const TriageStatus: React.FC<TriageStatusProps> = ({ status }) => {
  return (
    <Badge className={statusColors[status]}>
      {statusLabels[status]}
    </Badge>
  );
};

export default TriageStatus;
