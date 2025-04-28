
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClipboardList } from 'lucide-react';
import { usePatientHistory } from '@/hooks/usePatientHistory';
import PatientSelector from './patient/PatientSelector';
import PatientInfo from './patient/PatientInfo';
import MedicalRecordDialog from './patient/MedicalRecordDialog';

const DoctorPatientHistory: React.FC = () => {
  const {
    selectedPatientId,
    setSelectedPatientId,
    notes,
    setNotes,
    isDialogOpen,
    setIsDialogOpen,
    selectedPatient,
    patients,
    currentDoctor,
    handleAddMedicalRecord,
    formatDate,
  } = usePatientHistory();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Histórico Médico de Pacientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PatientSelector
            patients={patients}
            selectedPatientId={selectedPatientId}
            onPatientSelect={setSelectedPatientId}
          />

          {selectedPatient ? (
            <>
              <PatientInfo patient={selectedPatient} />

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Registros médicos</h3>
                
                <MedicalRecordDialog
                  isOpen={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  patient={selectedPatient}
                  doctorName={currentDoctor.name}
                  notes={notes}
                  onNotesChange={setNotes}
                  onSave={handleAddMedicalRecord}
                />
              </div>

              {(selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Médico</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPatient.medicalHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>{record.doctor}</TableCell>
                        <TableCell>{record.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Não há registros médicos para este paciente
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Selecione um paciente para ver seu histórico médico
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorPatientHistory;
