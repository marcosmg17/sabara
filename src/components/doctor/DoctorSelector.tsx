
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Doctor } from '@/types/doctor';

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedDoctorId: string;
  onDoctorSelect: (doctorId: string) => void;
}

const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctors,
  selectedDoctorId,
  onDoctorSelect,
}) => {
  return (
    <div className="mb-6">
      <Select
        value={selectedDoctorId}
        onValueChange={onDoctorSelect}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Selecione um médico" />
        </SelectTrigger>
        <SelectContent>
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id.toString()}>
              {doctor.name} - {doctor.specialty} (Sala {doctor.room})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DoctorSelector;
