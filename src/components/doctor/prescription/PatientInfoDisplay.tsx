
import React from 'react';
import { TriageEntry } from '@/types/triage';

interface PatientInfoDisplayProps {
  triage: TriageEntry | null;
}

const PatientInfoDisplay: React.FC<PatientInfoDisplayProps> = ({ triage }) => {
  if (!triage) return null;
  
  return (
    <>
      {triage.measurements && (
        <div className="bg-green-50 p-4 rounded-md mb-2">
          <h3 className="text-sm font-medium text-green-800 mb-2">Triagem de Enfermagem</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {triage.measurements.temperature && (
              <div><span className="font-medium">Temperatura:</span> {triage.measurements.temperature}°C</div>
            )}
            {triage.measurements.heartRate && (
              <div><span className="font-medium">Batimentos:</span> {triage.measurements.heartRate} BPM</div>
            )}
            {triage.measurements.bloodPressure && (
              <div><span className="font-medium">Pressão:</span> {triage.measurements.bloodPressure}</div>
            )}
            {triage.measurements.oxygenSaturation && (
              <div><span className="font-medium">Saturação O²:</span> {triage.measurements.oxygenSaturation}%</div>
            )}
            {triage.measurements.glucoseLevel && (
              <div><span className="font-medium">Glicemia:</span> {triage.measurements.glucoseLevel} mg/dL</div>
            )}
          </div>
          {triage.nurseNotes && (
            <div className="mt-2 border-t border-green-200 pt-2">
              <span className="font-medium">Observações da enfermagem:</span>
              <p className="text-sm mt-1">{triage.nurseNotes}</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-md mb-2">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Informações do Paciente</h3>
        <p className="text-sm text-blue-700"><strong>Nome:</strong> {triage.patientName}</p>
        <p className="text-sm text-blue-700"><strong>Idade:</strong> {triage.patientAge} anos</p>
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
    </>
  );
};

export default PatientInfoDisplay;
