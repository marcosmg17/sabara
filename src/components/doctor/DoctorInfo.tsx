
import React from 'react';
import { Doctor } from '@/types/doctor';
import { Switch } from '@/components/ui/switch';
import { useTriageActions } from '@/hooks/useTriageActions';

interface DoctorInfoProps {
  doctor: Doctor;
}

const DoctorInfo: React.FC<DoctorInfoProps> = ({ doctor }) => {
  const { toggleDoctorAvailability } = useTriageActions();

  const handleAvailabilityChange = (checked: boolean) => {
    toggleDoctorAvailability.mutate({ doctorId: doctor.id, available: checked });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{doctor.name}</h3>
          <p className="text-sm text-gray-500">Especialidade: {doctor.specialty}</p>
          <p className="text-sm text-gray-500">Sala: {doctor.room}</p>
          <p className="text-sm text-gray-500">
            Status: {doctor.available ? (
              <span className="text-green-600">Disponível</span>
            ) : (
              <span className="text-orange-500">Indisponível</span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Disponibilidade</span>
          <Switch
            checked={doctor.available}
            onCheckedChange={handleAvailabilityChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;
