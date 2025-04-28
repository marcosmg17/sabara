
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound } from 'lucide-react';
import { useDoctorData } from '@/hooks/useDoctorData';
import PatientList from './doctor/PatientList';
import DoctorInfo from './doctor/DoctorInfo';

const DoctorDashboard: React.FC = () => {
 
  const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor') || '{}');
  const selectedDoctorId = currentDoctor.id ? currentDoctor.id.toString() : '';
  
  const {
    selectedDoctor,
    assignedPatients,
    startPatientConsultation,
    completePatientConsultation
  } = useDoctorData(selectedDoctorId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            Painel do Médico
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDoctor ? (
            <>
              <DoctorInfo doctor={selectedDoctor} />
              {assignedPatients.length > 0 ? (
                <PatientList
                  assignedPatients={assignedPatients}
                  onStartConsultation={(id) => startPatientConsultation.mutate(id)}
                  onCompleteConsultation={(id) => completePatientConsultation.mutate(id)}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  "Você não possui pacientes atribuídos no momento"
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Não foi possível encontrar informações do médico logado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
