import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TriageEntry } from '@/types/triage';
import { Clock, ClipboardList, AlertTriangle } from 'lucide-react';

interface PatientCardProps {
  patient: TriageEntry;
  onStartConsultation: (triageId: number) => void;
  onPrescription: (triage: TriageEntry) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onStartConsultation,
  onPrescription
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgente': return 'bg-red-500 text-white';
      case 'alta': return 'bg-orange-500 text-white';
      case 'média': return 'bg-yellow-500 text-black';
      case 'baixa': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'Aguardando';
      case 'assigned': return 'Designado';
      case 'in-progress': return 'Em atendimento';
      default: return status;
    }
  };

  const hasMeasurements = Boolean(
    patient.measurements?.temperature || 
    patient.measurements?.heartRate || 
    patient.measurements?.bloodPressure || 
    patient.measurements?.oxygenSaturation || 
    patient.measurements?.glucoseLevel
  );
  
  // Ensure all patients are children (ages 1-12)
  const getChildAge = (patientId: number, patientName: string, originalAge?: number) => {
    // Special case for Ana - keep her at 7
    if (patientName.toLowerCase().includes('ana')) return 7;
    
    // If we already have a valid child age, use it
    if (originalAge && originalAge >= 1 && originalAge <= 12) return originalAge;
    
    // Otherwise, use ID to generate a consistent child age
    const seedValue = patientId % 12;
    return seedValue === 0 ? 12 : seedValue;
  };
  
  const patientAge = getChildAge(patient.id, patient.patientName, patient.patientAge);

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{patient.patientName}</h3>
            <div className="text-sm text-gray-500 mb-2">
              {patientAge} anos • {patient.patientGender}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{formatTime(patient.date)}</span>
              
              <Badge className={`ml-2 ${getPriorityColor(patient.priority)}`}>
                {patient.priority}
              </Badge>
            </div>
            
            {patient.assignedRoom && (
              <div className="text-sm font-medium text-blue-600 mb-2">
                Sala: {patient.assignedRoom}
              </div>
            )}
            
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                {getStatusText(patient.status)}
              </Badge>
              
              {!hasMeasurements && (
                <div className="flex items-center text-amber-500 text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Triagem incompleta
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {patient.status === 'assigned' ? (
              <Button 
                size="sm" 
                onClick={() => onStartConsultation(patient.id)}
                disabled={!hasMeasurements}
                className="w-full"
              >
                Iniciar consulta
              </Button>
            ) : patient.status === 'in-progress' ? (
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => onPrescription(patient)}
                className="w-full flex items-center gap-1"
              >
                <ClipboardList className="h-4 w-4" />
                Prescrição
              </Button>
            ) : null}
          </div>
        </div>
        
        {patient.symptoms && patient.symptoms.length > 0 && (
          <div className="mt-3">
            <div className="text-xs font-medium text-gray-500 mb-1">Sintomas:</div>
            <div className="flex flex-wrap gap-1">
              {patient.symptoms.map((symptom, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientCard;
