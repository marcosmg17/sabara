
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { ListCheck } from 'lucide-react';

const TriageQueueHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
        <ListCheck className="h-5 w-5" />
        Fila de Triagem
      </CardTitle>
    </CardHeader>
  );
};

export default TriageQueueHeader;
