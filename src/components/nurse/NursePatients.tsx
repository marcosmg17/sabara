
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const NursePatients: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Pacientes em Triagem</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Você não tem pacientes atribuídos no momento.
        </div>
      </CardContent>
    </Card>
  );
};

export default NursePatients;
