
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TriageMeasurements } from '@/types/triage';
import { AlertCircle, ThermometerIcon, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TriageMeasurementFieldsProps {
  measurements: {
    temperature: string;
    heartRate: string;
    bloodPressure: string;
    oxygenSaturation: string;
    glucoseLevel: string;
  };
  notes: string;
  onMeasurementChange: (field: keyof TriageMeasurements, value: string) => void;
  onNotesChange: (notes: string) => void;
}

// Define validation ranges for vital signs
interface ValidationRange {
  min: number;
  max: number;
  errorMessage: string;
}

const validationRanges: Record<string, ValidationRange> = {
  temperature: {
    min: 35,
    max: 42,
    errorMessage: "A temperatura deve estar entre 35°C e 42°C"
  },
  heartRate: {
    min: 40,
    max: 200,
    errorMessage: "Os batimentos cardíacos devem estar entre 40 e 200 BPM"
  },
  oxygenSaturation: {
    min: 70,
    max: 100,
    errorMessage: "A saturação de oxigênio deve estar entre 70% e 100%"
  },
  glucoseLevel: {
    min: 40,
    max: 500,
    errorMessage: "O nível de glicose deve estar entre 40 e 500 mg/dL"
  }
};

// Custom validation for blood pressure in format "systolic/diastolic"
const validateBloodPressure = (value: string): string => {
  if (!value) return '';
  
  const regex = /^(\d{2,3})\/(\d{2,3})$/;
  if (!regex.test(value)) {
    return "Formato incorreto. Use o formato sistólica/diastólica (ex: 120/80)";
  }
  
  const [systolic, diastolic] = value.split('/').map(Number);
  
  if (systolic < 70 || systolic > 220) {
    return "Pressão sistólica deve estar entre 70 e 220 mmHg";
  }
  
  if (diastolic < 40 || diastolic > 140) {
    return "Pressão diastólica deve estar entre 40 e 140 mmHg";
  }
  
  return '';
};

const TriageMeasurementFields: React.FC<TriageMeasurementFieldsProps> = ({
  measurements,
  notes,
  onMeasurementChange,
  onNotesChange
}) => {
  const { temperature, heartRate, bloodPressure, oxygenSaturation, glucoseLevel } = measurements;
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Handle numeric field validation
  const handleChange = (field: keyof TriageMeasurements, value: string) => {
    onMeasurementChange(field, value);
    
    // Clear error when field is empty
    if (!value) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
      return;
    }

    // Validate blood pressure separately
    if (field === 'bloodPressure') {
      const error = validateBloodPressure(value);
      setValidationErrors(prev => ({ ...prev, [field]: error }));
      return;
    }
    
    // For other fields, validate against ranges
    if (validationRanges[field]) {
      const numValue = parseFloat(value);
      const { min, max, errorMessage } = validationRanges[field];
      
      if (isNaN(numValue)) {
        setValidationErrors(prev => ({ ...prev, [field]: "Valor deve ser um número" }));
      } else if (numValue < min || numValue > max) {
        setValidationErrors(prev => ({ ...prev, [field]: errorMessage }));
      } else {
        setValidationErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="temperature" className="text-sm font-medium flex items-center gap-1">
            <ThermometerIcon className="h-4 w-4" />
            Temperatura (°C)
          </label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            placeholder="Ex: 37.5"
            value={temperature}
            onChange={(e) => handleChange('temperature', e.target.value)}
            className={cn(validationErrors.temperature && "border-red-500")}
          />
          {validationErrors.temperature && (
            <div className="text-xs flex items-center text-red-500 mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {validationErrors.temperature}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="heartRate" className="text-sm font-medium flex items-center gap-1">
            <HeartPulse className="h-4 w-4" />
            Batimentos Cardíacos (BPM)
          </label>
          <Input
            id="heartRate"
            type="number"
            placeholder="Ex: 80"
            value={heartRate}
            onChange={(e) => handleChange('heartRate', e.target.value)}
            className={cn(validationErrors.heartRate && "border-red-500")}
          />
          {validationErrors.heartRate && (
            <div className="text-xs flex items-center text-red-500 mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {validationErrors.heartRate}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="bloodPressure" className="text-sm font-medium">
            Pressão Arterial
          </label>
          <Input
            id="bloodPressure"
            placeholder="Ex: 120/80"
            value={bloodPressure}
            onChange={(e) => handleChange('bloodPressure', e.target.value)}
            className={cn(validationErrors.bloodPressure && "border-red-500")}
          />
          {validationErrors.bloodPressure && (
            <div className="text-xs flex items-center text-red-500 mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {validationErrors.bloodPressure}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="oxygenSaturation" className="text-sm font-medium">
            Saturação de O² (%)
          </label>
          <Input
            id="oxygenSaturation"
            type="number"
            min="0"
            max="100"
            placeholder="Ex: 98"
            value={oxygenSaturation}
            onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
            className={cn(validationErrors.oxygenSaturation && "border-red-500")}
          />
          {validationErrors.oxygenSaturation && (
            <div className="text-xs flex items-center text-red-500 mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {validationErrors.oxygenSaturation}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="glucoseLevel" className="text-sm font-medium">
          Glicemia (mg/dL)
        </label>
        <Input
          id="glucoseLevel"
          type="number"
          placeholder="Ex: 100"
          value={glucoseLevel}
          onChange={(e) => handleChange('glucoseLevel', e.target.value)}
          className={cn(validationErrors.glucoseLevel && "border-red-500")}
        />
        {validationErrors.glucoseLevel && (
          <div className="text-xs flex items-center text-red-500 mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {validationErrors.glucoseLevel}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Observações da Enfermagem
        </label>
        <Textarea
          id="notes"
          placeholder="Insira suas observações aqui..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
        />
      </div>
    </>
  );
};

export default TriageMeasurementFields;
