
import React from 'react';
import { Button } from '@/components/ui/button';

interface SymptomSelectorProps {
  symptoms: string[];
  selectedSymptoms: string[];
  toggleSymptom: (symptom: string) => void;
  showOtherInput: boolean;
  otherSymptoms: string;
  setOtherSymptoms: (value: string) => void;
  Textarea: React.ComponentType<any>;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  symptoms,
  selectedSymptoms,
  toggleSymptom,
  showOtherInput,
  otherSymptoms,
  setOtherSymptoms,
  Textarea
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {symptoms.map((symptom) => (
          <Button
            key={symptom}
            type="button"
            variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
            className={`${
              selectedSymptoms.includes(symptom) 
              ? 'bg-sabara-primary text-white' 
              : 'border-sabara-secondary text-gray-700'
            } w-full justify-start`}
            onClick={() => toggleSymptom(symptom)}
          >
            {symptom}
          </Button>
        ))}
        <Button
          type="button"
          variant={selectedSymptoms.includes("Outros") ? "default" : "outline"}
          className={`${
            selectedSymptoms.includes("Outros") 
            ? 'bg-sabara-primary text-white' 
            : 'border-sabara-secondary text-gray-700'
          } w-full justify-start`}
          onClick={() => toggleSymptom("Outros")}
        >
          Outros
        </Button>
      </div>

      {showOtherInput && (
        <div className="mt-2">
          <label htmlFor="otherSymptoms" className="block text-sm font-medium text-gray-700 mb-1">
            Descreva outros sintomas
          </label>
          <Textarea
            id="otherSymptoms"
            placeholder="Descreva seus sintomas aqui..."
            value={otherSymptoms}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOtherSymptoms(e.target.value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default SymptomSelector;
