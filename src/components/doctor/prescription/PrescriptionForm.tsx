
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PrescriptionFormProps {
  diagnosis: string;
  setDiagnosis: (value: string) => void;
  prescription: string;
  setPrescription: (value: string) => void;
  observation: string;
  setObservation: (value: string) => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  diagnosis,
  setDiagnosis,
  prescription,
  setPrescription,
  observation,
  setObservation
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="diagnosis" className="text-sm font-medium">
          Diagnóstico
        </label>
        <Input
          id="diagnosis"
          placeholder="Insira o diagnóstico"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="prescription" className="text-sm font-medium">
          Prescrição Médica
        </label>
        <Textarea
          id="prescription"
          placeholder="Insira a prescrição médica..."
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          rows={6}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="observation" className="text-sm font-medium">
          Observações
        </label>
        <Textarea
          id="observation"
          placeholder="Adicione observações adicionais..."
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

export default PrescriptionForm;
