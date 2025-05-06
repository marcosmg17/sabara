
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SymptomBadgesProps {
  symptoms: string[];
}

const SymptomBadges: React.FC<SymptomBadgesProps> = ({ symptoms }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {symptoms.map((symptom, index) => (
        <Badge key={index} variant="outline">{symptom}</Badge>
      ))}
    </div>
  );
};

export default SymptomBadges;
