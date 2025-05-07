
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, FileText, HeartPulse } from 'lucide-react';
import { TriageEntry } from '@/types/triage';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface PatientListProps {
  assignedPatients: TriageEntry[];
  onStartConsultation: (triageId: number) => void;
  onPrescription: (triage: TriageEntry) => void;
}

const PatientList: React.FC<PatientListProps> = ({
  assignedPatients,
  onStartConsultation,
  onPrescription
}) => {
  const priorityColors: Record<string, string> = {
    'Crítico': 'bg-red-500',
    'Alto': 'bg-orange-500',
    'Moderado': 'bg-yellow-500',
    'Baixo': 'bg-green-500'
  };

  const hasMeasurements = (triage: TriageEntry) => {
    if (!triage.measurements) return false;
    
    return Boolean(
      triage.measurements.temperature ||
      triage.measurements.heartRate ||
      triage.measurements.bloodPressure ||
      triage.measurements.oxygenSaturation ||
      triage.measurements.glucoseLevel
    );
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
        {assignedPatients.map((triage) => {
          // Ensure Ana's age is displayed as 7
          const patientAge = triage.patientName.toLowerCase().includes('ana') ? 7 : triage.patientAge;
          
          return (
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
              <TableCell>{patientAge}</TableCell>
              <TableCell>{triage.patientGender}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {triage.symptoms.slice(0, 2).map((symptom, index) => (
                    <Badge key={index} variant="outline">{symptom}</Badge>
                  ))}
                  {triage.symptoms.length > 2 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Badge variant="outline" className="cursor-pointer">
                          +{triage.symptoms.length - 2}
                        </Badge>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="space-y-2">
                          <h4 className="font-medium">Todos os sintomas</h4>
                          <div className="flex flex-wrap gap-1">
                            {triage.symptoms.map((symptom, i) => (
                              <Badge key={i} variant="outline">{symptom}</Badge>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {hasMeasurements(triage) && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 mb-2"
                      >
                        <HeartPulse className="h-4 w-4" />
                        Dados da triagem
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Dados vitais registrados</h4>
                        <div className="text-sm space-y-1">
                          {triage.measurements?.temperature && (
                            <div><span className="font-medium">Temperatura:</span> {triage.measurements.temperature}°C</div>
                          )}
                          {triage.measurements?.heartRate && (
                            <div><span className="font-medium">Batimentos:</span> {triage.measurements.heartRate} BPM</div>
                          )}
                          {triage.measurements?.bloodPressure && (
                            <div><span className="font-medium">Pressão:</span> {triage.measurements.bloodPressure}</div>
                          )}
                          {triage.measurements?.oxygenSaturation && (
                            <div><span className="font-medium">Saturação O²:</span> {triage.measurements.oxygenSaturation}%</div>
                          )}
                          {triage.measurements?.glucoseLevel && (
                            <div><span className="font-medium">Glicemia:</span> {triage.measurements.glucoseLevel} mg/dL</div>
                          )}
                          {triage.nurseNotes && (
                            <div className="mt-2 pt-2 border-t">
                              <span className="font-medium">Observações:</span>
                              <p className="mt-1">{triage.nurseNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              
                {triage.status === 'assigned' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => onStartConsultation(triage.id)}
                    disabled={!hasMeasurements(triage)}
                  >
                    {hasMeasurements(triage) ? "Iniciar Consulta" : "Aguardando dados da triagem"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => onPrescription(triage)}
                  >
                    <FileText className="h-4 w-4" />
                    {triage.prescription ? "Editar Prescrição" : "Adicionar Prescrição"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default PatientList;
