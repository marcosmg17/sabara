
import { TriageMeasurements } from '@/types/triage';

export const useTriageMeasurements = () => {
  // Function to determine if measurements exist
  const hasMeasurements = (measurements?: TriageMeasurements): boolean => {
    if (!measurements) return false;
    
    return Boolean(
      measurements.temperature ||
      measurements.heartRate ||
      measurements.bloodPressure ||
      measurements.oxygenSaturation ||
      measurements.glucoseLevel
    );
  };

  return { hasMeasurements };
};
