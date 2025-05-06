
import { useNurseActions } from './useNurseActions';
import { useDoctorActions } from './useDoctorActions';
import { useUTIActions } from './useUTIActions';

export const useTriageActions = () => {
  const nurseActions = useNurseActions();
  const doctorActions = useDoctorActions();
  const utiActions = useUTIActions();

  return {
    // Nurse actions
    assignNurse: nurseActions.assignNurse,
    updateTriageMeasurements: nurseActions.updateTriageMeasurements,
    completeNurseTriage: nurseActions.completeNurseTriage,
    sendToDoctor: nurseActions.sendToDoctor, // Add the new sendToDoctor action
    
    // Doctor actions
    assignDoctor: doctorActions.assignDoctor,
    toggleDoctorAvailability: doctorActions.toggleDoctorAvailability,
    removeTriage: doctorActions.removeTriage,
    
    // UTI actions
    assignToUTI: utiActions.assignToUTI
  };
};
