import React from 'react';
import { TriageEntry } from '@/types/triage';

interface TriagePatientInfoProps {
  triage: TriageEntry;
}

const TriagePatientInfo: React.FC<TriagePatientInfoProps> = ({ triage }) => {
  // Ensure all patients are children (ages 1-12)
  const getChildAge = (patientId: number, patientName: string, originalAge?: number) => {
    // Special case for Ana - keep her at 7
    if (patientName.toLowerCase().includes('ana')) return 7;
    
    // If we already have a valid child age, use it
    if (originalAge && originalAge >= 1 && originalAge <= 12) return originalAge;
    
    // Otherwise, use ID to generate a consistent child age
    const seedValue = patientId % 12;
    return seedValue === 0 ? 12 : seedValue;
  };
  
  const patientAge = getChildAge(triage.id, triage.patientName, triage.patientAge);

  return (
    <div className="bg-blue-50 p-4 rounded-md mb-2">
      <h3 className="text-sm font-medium text-blue-800 mb-1">Informações do Paciente</h3>
      <p className="text-sm text-blue-700"><strong>Nome:</strong> {triage.patientName}</p>
      <p className="text-sm text-blue-700"><strong>Idade:</strong> {patientAge} anos</p>
      <p className="text-sm text-blue-700"><strong>Gênero:</strong> {triage.patientGender}</p>
      <div className="mt-1">
        <strong className="text-sm text-blue-700">Sintomas reportados:</strong>
        <div className="flex flex-wrap gap-1 mt-1">
          {triage.symptoms.map((symptom, i) => (
            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {symptom}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TriagePatientInfo;
