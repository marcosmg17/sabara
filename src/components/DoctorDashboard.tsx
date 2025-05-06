
import React, { useState, useEffect } from 'react';
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

  // Aumentamos a frequência do polling para 3 segundos para atualizar mais rapidamente a lista de pacientes
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    }, 3000); // Atualiza a cada 3 segundos
    
    return () => clearInterval(interval);
  }, [queryClient]);

  const handleStartConsultation = (triageId: number) => {
    startPatientConsultation.mutate(triageId);
  };

  const handleOpenPrescription = (triage: TriageEntry) => {
    setSelectedTriage(triage);
    setIsPrescriptionOpen(true);
  };

  const handleSavePrescription = (triageId: number, diagnosis: string, prescription: string, observation?: string) => {
    const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
    
    const updatedQueue = currentQueue.map(triage => 
      triage.id === triageId 
        ? { 
            ...triage,
            doctorDiagnosis: diagnosis,
            prescription: prescription,
            doctorObservation: observation
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

  const handlePrintPrescription = (triageId: number, diagnosis: string, prescription: string, observation?: string) => {
    // Create a printable version of the prescription
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erro ao imprimir",
        description: "Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está ativado.",
        variant: "destructive"
      });
      return;
    }

    const triage = assignedPatients.find(t => t.id === triageId);
    if (!triage) return;

    const currentDate = new Date().toLocaleDateString('pt-BR');
    const doctor = currentDoctor.name || 'Médico(a)';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescrição Médica - ${triage.patientName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .patient-info {
              margin-bottom: 20px;
            }
            .diagnosis {
              margin-bottom: 20px;
              background-color: #f0f7ff;
              padding: 15px;
              border-radius: 5px;
            }
            .prescription {
              border: 1px solid #ccc;
              padding: 15px;
              margin-bottom: 20px;
              min-height: 200px;
            }
            .observation {
              border: 1px solid #ccc;
              padding: 15px;
              margin-bottom: 20px;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #ccc;
              padding-top: 10px;
              text-align: center;
            }
            .signature {
              margin-top: 70px;
              border-top: 1px solid #333;
              width: 200px;
              margin-left: auto;
              margin-right: auto;
              text-align: center;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Prescrição Médica</h1>
            <p>Data: ${currentDate}</p>
          </div>
          
          <div class="patient-info">
            <h2>Informações do Paciente</h2>
            <p><strong>Nome:</strong> ${triage.patientName}</p>
            <p><strong>Idade:</strong> ${triage.patientAge} anos</p>
            <p><strong>Sexo:</strong> ${triage.patientGender}</p>
          </div>
          
          <div class="diagnosis">
            <h2>Diagnóstico</h2>
            <p>${diagnosis || 'Não informado'}</p>
          </div>
          
          <div class="prescription">
            <h2>Prescrição</h2>
            <p>${prescription.replace(/\n/g, '<br>') || 'Sem prescrição'}</p>
          </div>
          
          ${observation ? `
          <div class="observation">
            <h2>Observações</h2>
            <p>${observation.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}
          
          <div class="signature">
            ${doctor}<br>
            CRM
          </div>
          
          <div class="footer">
            Este documento é uma prescrição médica e deve ser utilizado conforme orientação do profissional.
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    toast({
      title: "Impressão iniciada",
      description: "A prescrição está sendo preparada para impressão",
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
            observation: triage.doctorObservation,
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
                  Você não possui pacientes atribuídos no momento
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
        onPrint={handlePrintPrescription}
      />
    </div>
  );
};

export default DoctorDashboard;
