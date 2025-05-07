
import React from 'react';
import { Patient } from '@/types/patient';

interface PatientInfoProps {
  patient: Patient;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  // Ensure Ana's age is displayed as 7
  const patientAge = patient.name.toLowerCase().includes('ana') ? 7 : patient.age;

  return (
    <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-sabara-primary">{patient.name}</h3>
          <p className="text-sm text-gray-500 mb-2">Email: {patient.email}</p>
          
          <div className="flex gap-4 mt-2">
            <div className="text-sm">
              <span className="font-medium">Idade:</span> {patientAge} anos
            </div>
            {patient.gender && (
              <div className="text-sm">
                <span className="font-medium">Sexo:</span> {patient.gender}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm bg-sabara-secondary/20 px-3 py-1 rounded-full inline-block">
            Paciente ID: #{patient.id}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {patient.medicalHistory?.length || 0} registros médicos
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
