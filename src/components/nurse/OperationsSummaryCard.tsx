
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface OperationsStats {
  waiting: number;
  inProgress: number;
  completed: number;
  critical: number;
}

interface OperationsSummaryCardProps {
  stats: OperationsStats;
}

const OperationsSummaryCard: React.FC<OperationsSummaryCardProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Resumo de Operações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{stats.waiting}</div>
            <div className="text-sm text-blue-700">Aguardando</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">{stats.inProgress}</div>
            <div className="text-sm text-yellow-700">Em Atendimento</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            <div className="text-sm text-green-700">Concluídos</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
            <div className="text-sm text-red-700">Casos Críticos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationsSummaryCard;
