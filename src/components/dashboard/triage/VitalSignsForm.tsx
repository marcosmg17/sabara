
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ThermometerIcon, HeartPulse, Lungs } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VitalSignsFormProps {
  temperature: string;
  setTemperature: (value: string) => void;
  heartRate: string;
  setHeartRate: (value: string) => void;
  preTriageNotes: string;
  setPreTriageNotes: (value: string) => void;
}

// Define validation ranges
const validationRanges = {
  temperature: {
    min: 35,
    max: 42,
    errorMessage: "A temperatura deve estar entre 35°C e 42°C"
  },
  heartRate: {
    min: 40,
    max: 200,
    errorMessage: "Os batimentos cardíacos devem estar entre 40 e 200 BPM"
  }
};

const VitalSignsForm: React.FC<VitalSignsFormProps> = ({
  temperature,
  setTemperature,
  heartRate,
  setHeartRate,
  preTriageNotes,
  setPreTriageNotes
}) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateField = (field: 'temperature' | 'heartRate', value: string) => {
    if (!value) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
      return;
    }

    const numValue = parseFloat(value);
    const { min, max, errorMessage } = validationRanges[field];
    
    if (isNaN(numValue)) {
      setValidationErrors(prev => ({ ...prev, [field]: "Valor deve ser um número" }));
    } else if (numValue < min || numValue > max) {
      setValidationErrors(prev => ({ ...prev, [field]: errorMessage }));
    } else {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTemperature(value);
    validateField('temperature', value);
  };

  const handleHeartRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHeartRate(value);
    validateField('heartRate', value);
  };

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <div className="space-y-1">
        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
          <ThermometerIcon className="h-4 w-4" />
          Temperatura (°C)
        </label>
        <Input
          id="temperature"
          type="number"
          step="0.1"
          placeholder="Ex: 37.5"
          value={temperature}
          onChange={handleTemperatureChange}
          className={cn("w-full", validationErrors.temperature && "border-red-500")}
        />
        {validationErrors.temperature && (
          <div className="text-xs flex items-center text-red-500 mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {validationErrors.temperature}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
          <HeartPulse className="h-4 w-4" />
          Batimentos Cardíacos (BPM)
        </label>
        <Input
          id="heartRate"
          type="number"
          placeholder="Ex: 80"
          value={heartRate}
          onChange={handleHeartRateChange}
          className={cn("w-full", validationErrors.heartRate && "border-red-500")}
        />
        {validationErrors.heartRate && (
          <div className="text-xs flex items-center text-red-500 mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {validationErrors.heartRate}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <label htmlFor="preTriageNotes" className="block text-sm font-medium text-gray-700">
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
