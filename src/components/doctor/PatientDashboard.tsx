
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PatientCard from './PatientCard';
import { TriageEntry } from '@/types/triage';
import DoctorInfo from './DoctorInfo';
import { Doctor } from '@/types/doctor';

interface PatientDashboardProps {
  doctor: Doctor;
  assignedPatients: TriageEntry[];
  onStartConsultation: (triageId: number) => void;
  onPrescription: (triage: TriageEntry) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({
  doctor,
  assignedPatients,
  onStartConsultation,
  onPrescription
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <DoctorInfo doctor={doctor} />
        
        {assignedPatients.length > 0 ? (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Pacientes designados para atendimento</h3>
            <div>
              {assignedPatients.map(patient => (
                <PatientCard 
                  key={patient.id}
                  patient={patient}
                  onStartConsultation={onStartConsultation}
                  onPrescription={onPrescription}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Você não possui pacientes atribuídos no momento
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientDashboard;
