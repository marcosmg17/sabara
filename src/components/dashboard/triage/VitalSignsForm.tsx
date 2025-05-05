
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface VitalSignsFormProps {
  temperature: string;
  setTemperature: (value: string) => void;
  heartRate: string;
  setHeartRate: (value: string) => void;
  preTriageNotes: string;
  setPreTriageNotes: (value: string) => void;
}

const VitalSignsForm: React.FC<VitalSignsFormProps> = ({
  temperature,
  setTemperature,
  heartRate,
  setHeartRate,
  preTriageNotes,
  setPreTriageNotes
}) => {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <div>
        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
          Temperatura (°C)
        </label>
        <Input
          id="temperature"
          type="number"
          step="0.1"
          placeholder="Ex: 37.5"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 mb-1">
          Batimentos Cardíacos (BPM)
        </label>
        <Input
          id="heartRate"
          type="number"
          placeholder="Ex: 80"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="preTriageNotes" className="block text-sm font-medium text-gray-700 mb-1">
          Observações adicionais
        </label>
        <Textarea
          id="preTriageNotes"
          placeholder="Descreva qualquer informação adicional relevante..."
          value={preTriageNotes}
          onChange={(e) => setPreTriageNotes(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default VitalSignsForm;
