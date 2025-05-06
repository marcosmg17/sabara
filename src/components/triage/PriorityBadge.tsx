
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { priorityColors } from '@/hooks/useTriageQueue';

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  return (
    <Badge className={priorityColors[priority]}>
      {priority}
    </Badge>
  );
};

export default PriorityBadge;
