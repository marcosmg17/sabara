
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TriageMeasurements } from '@/types/triage';

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

const TriageMeasurementFields: React.FC<TriageMeasurementFieldsProps> = ({
  measurements,
  notes,
  onMeasurementChange,
  onNotesChange
}) => {
  const { temperature, heartRate, bloodPressure, oxygenSaturation, glucoseLevel } = measurements;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="temperature" className="text-sm font-medium">
            Temperatura (°C)
          </label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            placeholder="Ex: 37.5"
            value={temperature}
            onChange={(e) => onMeasurementChange('temperature', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="heartRate" className="text-sm font-medium">
            Batimentos Cardíacos (BPM)
          </label>
          <Input
            id="heartRate"
            type="number"
            placeholder="Ex: 80"
            value={heartRate}
            onChange={(e) => onMeasurementChange('heartRate', e.target.value)}
          />
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
            onChange={(e) => onMeasurementChange('bloodPressure', e.target.value)}
          />
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
            onChange={(e) => onMeasurementChange('oxygenSaturation', e.target.value)}
          />
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
          onChange={(e) => onMeasurementChange('glucoseLevel', e.target.value)}
        />
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
