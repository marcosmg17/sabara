
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTriageQueue } from '@/hooks/useTriageQueue';
import { priorityColors } from '@/hooks/useTriageQueue';
import { Nurse } from '@/types/nurse';

interface NursePatientsProps {
  nurse?: Nurse;
}

const NursePatients: React.FC<NursePatientsProps> = ({ nurse }) => {
  const { triageQueue, isLoading } = useTriageQueue();
  
  const myPatients = triageQueue.filter(
    patient => 
      patient.assignedNurse && 
      nurse && 
      patient.assignedNurse.id === nurse.id && 
      patient.status === 'nurse-triage'
  );
  
  const hasPatients = myPatients.length > 0;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Pacientes em Triagem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse bg-gray-200 h-6 w-3/4 mx-auto rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Pacientes em Triagem</CardTitle>
      </CardHeader>
      <CardContent>
        {hasPatients ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Sintomas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.patientName}</TableCell>
                  <TableCell>{patient.patientAge} anos</TableCell>
                  <TableCell>
                    <Badge className={priorityColors[patient.priority]}>
                      {patient.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {patient.symptoms.slice(0, 2).map((symptom, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {symptom}
                        </span>
                      ))}
                      {patient.symptoms.length > 2 && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          +{patient.symptoms.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Você não tem pacientes atribuídos no momento.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NursePatients;
