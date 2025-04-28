
import React from 'react';
import { Patient } from '@/types/patient';

interface PatientInfoProps {
  patient: Patient;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md mb-6">
      <h3 className="text-lg font-medium">{patient.name}</h3>
      <p className="text-sm text-gray-500">Email: {patient.email}</p>
      <p className="text-sm text-gray-500">
        {patient.age && `Idade: ${patient.age} anos`}
        {patient.gender && ` • Sexo: ${patient.gender}`}
      </p>
    </div>
  );
};

export default PatientInfo;
