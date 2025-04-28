
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExamResult {
  id: number;
  name: string;
  date: string;
  status: string;
  pdfLink: string;
}

interface ExamResultsProps {
  examResults: ExamResult[];
}

const ExamResults: React.FC<ExamResultsProps> = ({ examResults }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disponível':
        return 'bg-green-500';
      case 'pendente':
        return 'bg-yellow-500';
      case 'em análise':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDownload = (pdfLink: string) => {
    window.open(pdfLink, '_blank');
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-sabara-primary flex items-center space-x-2">
          <File className="h-5 w-5" />
          <span>Resultados de Exames</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {examResults.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-500">Você não possui resultados de exames.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {examResults.map((exam) => (
              <div 
                key={exam.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{exam.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Data: {formatDate(exam.date)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status}
                    </Badge>
                    {exam.status.toLowerCase() === 'disponível' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-sabara-primary text-sabara-primary hover:bg-sabara-primary hover:text-white"
                        onClick={() => handleDownload(exam.pdfLink)}
                      >
                        <Download className="h-4 w-4 mr-1" /> Baixar PDF
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamResults;
