
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Triage {
  id: number;
  date: string;
  symptoms: string[];
  priority: string;
  recommendation: string;
}

interface TriageHistoryProps {
  triageHistory: Triage[];
}

const TriageHistory: React.FC<TriageHistoryProps> = ({ triageHistory }) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };


  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'crítico':
        return 'bg-red-500';
      case 'alto':
        return 'bg-orange-500';
      case 'moderado':
        return 'bg-yellow-500';
      case 'baixo':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-sabara-primary flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Histórico de Triagem</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {triageHistory.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-500">Você não possui registros de triagem.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {triageHistory.map((triage) => (
              <div 
                key={triage.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="mb-3 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {formatDate(triage.date)}
                  </div>
                  <Badge className={getPriorityColor(triage.priority)}>
                    Prioridade: {triage.priority}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm font-medium mb-1">Sintomas reportados:</div>
                  <div className="flex flex-wrap gap-2">
                    {triage.symptoms.map((symptom, index) => (
                      <span 
                        key={index} 
                        className="bg-sabara-secondary/50 text-gray-700 px-2 py-1 rounded-md text-xs"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Recomendação:</div>
                  <p className="text-sm text-gray-700">{triage.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TriageHistory;
