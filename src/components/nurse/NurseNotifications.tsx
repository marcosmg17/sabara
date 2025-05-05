
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const NurseNotifications: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
            <div className="font-medium">Novo protocolo de triagem</div>
            <p className="text-sm text-gray-600">Um novo protocolo de triagem foi implementado. Por favor, revise as diretrizes atualizadas.</p>
          </div>
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <div className="font-medium">Alerta de ocupação</div>
            <p className="text-sm text-gray-600">A capacidade da sala de espera está em 80%. Favor agilizar o processo de triagem.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NurseNotifications;
