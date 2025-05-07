
import { useNurseActions } from './useNurseActions';
import { useDoctorActions } from './useDoctorActions';
import { useUTIActions } from './useUTIActions';
import { usePatientNotifications } from './usePatientNotifications';

export const useTriageActions = () => {
  const nurseActions = useNurseActions();
  const doctorActions = useDoctorActions();
  const utiActions = useUTIActions();
  const { notifyPatient } = usePatientNotifications();

  return {
    // Nurse actions
    assignNurse: nurseActions.assignNurse,
    updateTriageMeasurements: nurseActions.updateTriageMeasurements,
    completeNurseTriage: nurseActions.completeNurseTriage,
    sendToDoctor: nurseActions.sendToDoctor,
    
    // Doctor actions
    assignDoctor: doctorActions.assignDoctor,
    toggleDoctorAvailability: doctorActions.toggleDoctorAvailability,
    removeTriage: doctorActions.removeTriage,
    
    // UTI actions
    assignToUTI: utiActions.assignToUTI,
    
    // Patient notification utility
    notifyPatient
  };
};
