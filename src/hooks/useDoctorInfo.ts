
import { Doctor } from '@/types/doctor';
import { useDoctorActions } from './useDoctorActions';

export const useDoctorInfo = () => {
  const { toggleDoctorAvailability } = useDoctorActions();

  return {
    toggleDoctorAvailability
  };
};
