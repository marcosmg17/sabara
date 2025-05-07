
import { useState, useEffect } from 'react';
import { TriageEntry } from '@/types/triage';

export const usePrescriptionDialog = (triage: TriageEntry | null) => {
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [prescription, setPrescription] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (triage) {
      setDiagnosis(triage.doctorDiagnosis || '');
      setPrescription(triage.prescription || '');
      setObservation(triage.doctorObservation || '');
    }
  }, [triage]);

  return {
    diagnosis,
    setDiagnosis,
    prescription,
    setPrescription,
    observation,
    setObservation,
    saving,
    setSaving
  };
};
