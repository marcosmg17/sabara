
import React, { useState } from 'react';
import { useDoctorData } from '@/hooks/useDoctorData';
import { TriageEntry } from '@/types/triage';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTriageActions } from '@/hooks/useTriageActions';
import { usePatientNotifications } from '@/hooks/usePatientNotifications';
import { usePatientConsultation } from '@/hooks/usePatientConsultation';
import DoctorHeader from './doctor/DoctorHeader';
import PatientDashboard from './doctor/PatientDashboard';
import PrescriptionDialog from './doctor/PrescriptionDialog';
import UTIDialog from './triage/UTIDialog';

const DoctorDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { assignToUTI } = useTriageActions();
  const { notifyPatient } = usePatientNotifications();
  const { handleCompleteConsultation } = usePatientConsultation();
  
  const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');
  const selectedDoctorId = currentDoctor.id ? currentDoctor.id.toString() : '';
  
  const [selectedTriage, setSelectedTriage] = useState<TriageEntry | null>(null);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [selectedTriageId, setSelectedTriageId] = useState<number | null>(null);
  const [isUtiDialogOpen, setIsUtiDialogOpen] = useState(false);
  
  const {
    selectedDoctor,
    assignedPatients,
    startPatientConsultation
  } = useDoctorData(selectedDoctorId);

  // Aumentamos a frequência do polling para 3 segundos para atualizar mais rapidamente a lista de pacientes
  React.useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['triageQueue'] });
    }, 3000); // Atualiza a cada 3 segundos
    
    return () => clearInterval(interval);
  }, [queryClient]);

  const handleStartConsultation = (triageId: number) => {
    startPatientConsultation.mutate(triageId);
    
    // Notification to the patient
    const currentQueue = queryClient.getQueryData(['triageQueue']) as TriageEntry[] || [];
    const triage = currentQueue.find(t => t.id === triageId);
    if (triage) {
      notifyPatient.mutate({
        patientId: triage.patientId,
        notification: {
          title: "Consulta iniciada",
          message: `O Dr. ${currentDoctor.name || 'médico(a)'} começou sua consulta. Por favor, aguarde na sala ${triage.assignedRoom || 'indicada'}.`
        }
      });
    }
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

  const handleAssignUTI = (triageId: number) => {
    setSelectedTriageId(triageId);
    setIsUtiDialogOpen(true);
    setIsPrescriptionOpen(false);
  };
  
  const handleUTIAssignment = (triageId: number, bedId: string) => {
    // Now we correctly call assignToUTI with both required parameters
    assignToUTI.mutate({ triageId, bedId });
    setIsUtiDialogOpen(false);
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

  return (
    <div className="space-y-6">
      <DoctorHeader title="Painel do Médico" />
      
      {selectedDoctor ? (
        <PatientDashboard
          doctor={selectedDoctor}
          assignedPatients={assignedPatients}
          onStartConsultation={handleStartConsultation}
          onPrescription={handleOpenPrescription}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          Não foi possível encontrar informações do médico logado
        </div>
      )}

      <PrescriptionDialog
        triage={selectedTriage}
        open={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        onSave={handleSavePrescription}
        onComplete={handleCompleteConsultation}
        onPrint={handlePrintPrescription}
        onAssignUTI={handleAssignUTI}
      />
      
      <UTIDialog
        triageId={selectedTriageId}
        open={isUtiDialogOpen}
        onClose={() => setIsUtiDialogOpen(false)}
        onAssign={handleUTIAssignment}
      />
    </div>
  );
};

export default DoctorDashboard;
