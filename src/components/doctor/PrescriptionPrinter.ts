
import { TriageEntry } from '@/types/triage';
import { useToast } from '@/hooks/use-toast';

export const usePrescriptionPrinter = () => {
  const { toast } = useToast();

  const printPrescription = (triageId: number, diagnosis: string, prescription: string, observation?: string, triage?: TriageEntry) => {
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

    if (!triage) return;

    const currentDate = new Date().toLocaleDateString('pt-BR');
    const doctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}').name || 'Médico(a)';
    
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

  return { printPrescription };
};
