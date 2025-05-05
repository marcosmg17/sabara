
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound } from 'lucide-react';
import { useDoctorData } from '@/hooks/useDoctorData';
import PatientList from './doctor/PatientList';
import DoctorInfo from './doctor/DoctorInfo';
import PrescriptionDialog from './doctor/PrescriptionDialog';
import { TriageEntry } from '@/types/triage';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const DoctorDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');
  const selectedDoctorId = currentDoctor.id ? currentDoctor.id.toString() : '';
  
  const [selectedTriage, setSelectedTriage] = useState<TriageEntry | null>(null);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  
  const {
    selectedDoctor,
    assignedPatients,
    startPatientConsultation,
    completePatientConsultation
  } = useDoctorData(selectedDoctorId);

  const handleStartConsultation = (triageId: number) => {
    startPatientConsultation.mutate(triageId);
  };

  const handleOpenPrescription = (triage: TriageEntry) => {
    setSelectedTriage(triage);
    setIsPrescriptionOpen(true);
  };

  const handleSavePrescription = (triageId: number, diagnosis: string, prescription: string) => {
    const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
    
    const updatedQueue = currentQueue.map(triage => 
      triage.id === triageId 
        ? { 
            ...triage,
            doctorDiagnosis: diagnosis,
            prescription: prescription
          } 
        : triage
    );
    
    localStorage.setItem('triageQueue', JSON.stringify(updatedQueue));
    queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    
    toast({
      title: "Prescrição salva",
      description: "Os dados do atendimento foram salvos com sucesso",
    });
  };

  const handleCompleteConsultation = (triageId: number) => {
    const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
    const triage = currentQueue.find(t => t.id === triageId);
    
    // Add to patient history before completing
    if (triage) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: any) => {
        if (user.id === triage.patientId) {
          const medicalHistory = user.medicalHistory || [];
          medicalHistory.unshift({
            id: Date.now(),
            date: new Date().toISOString(),
            doctor: currentDoctor.name,
            notes: triage.doctorDiagnosis || 'Consulta realizada',
            prescription: triage.prescription,
            measurements: triage.measurements
          });
          return { ...user, medicalHistory };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
    
    completePatientConsultation.mutate(triageId);
    setIsPrescriptionOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            Painel do Médico
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDoctor ? (
            <>
              <DoctorInfo doctor={selectedDoctor} />
              {assignedPatients.length > 0 ? (
                <PatientList
                  assignedPatients={assignedPatients}
                  onStartConsultation={handleStartConsultation}
                  onPrescription={handleOpenPrescription}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  "Você não possui pacientes atribuídos no momento"
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Não foi possível encontrar informações do médico logado
            </div>
          )}
        </CardContent>
      </Card>

      <PrescriptionDialog
        triage={selectedTriage}
        open={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        onSave={handleSavePrescription}
        onComplete={handleCompleteConsultation}
      />
    </div>
  );
};

export default DoctorDashboard;
