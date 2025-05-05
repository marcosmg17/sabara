
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope } from 'lucide-react';
import { Nurse } from '@/types/nurse';

interface NurseInfoCardProps {
  nurse: Nurse;
}

const NurseInfoCard: React.FC<NurseInfoCardProps> = ({ nurse }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Enfermeiro(a) de plantão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-sabara-primary text-white flex items-center justify-center text-xl font-bold">
            {nurse.name?.[0]}
          </div>
          <div className="ml-4">
            <h3 className="font-medium">{nurse.name}</h3>
            <p className="text-sm text-gray-600">{nurse.room && `Sala ${nurse.room}`}</p>
            <Badge className="mt-1 bg-green-500">{nurse.available ? 'Disponível' : 'Em atendimento'}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NurseInfoCard;
