
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { TriageEntry } from '@/types/doctor';

interface PatientListProps {
  assignedPatients: TriageEntry[];
  onStartConsultation: (triageId: number) => void;
  onCompleteConsultation: (triageId: number) => void;
}

const PatientList: React.FC<PatientListProps> = ({
  assignedPatients,
  onStartConsultation,
  onCompleteConsultation,
}) => {
  const priorityColors: Record<string, string> = {
    'Crítico': 'bg-red-500',
    'Alto': 'bg-orange-500',
    'Moderado': 'bg-yellow-500',
    'Baixo': 'bg-green-500'
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Idade</TableHead>
          <TableHead>Sexo</TableHead>
          <TableHead>Sintomas</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignedPatients.map((triage) => (
          <TableRow key={triage.id}>
            <TableCell>
              <Badge className={
                triage.status === 'assigned' ? 'bg-purple-500' : 
                triage.status === 'in-progress' ? 'bg-amber-500' : 
                'bg-gray-500'
              }>
                {triage.status === 'assigned' ? 'Atribuído' : 
                 triage.status === 'in-progress' ? 'Em atendimento' : 
                 'Concluído'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={priorityColors[triage.priority]}>
                {triage.priority}
              </Badge>
            </TableCell>
            <TableCell>{triage.patientName}</TableCell>
            <TableCell>{triage.patientAge}</TableCell>
            <TableCell>{triage.patientGender}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {triage.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline">{symptom}</Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {triage.status === 'assigned' ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => onStartConsultation(triage.id)}
                >
                  Iniciar Consulta
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => onCompleteConsultation(triage.id)}
                >
                  <Check className="h-4 w-4" />
                  Concluir
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PatientList;
