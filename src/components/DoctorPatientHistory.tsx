
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClipboardList } from 'lucide-react';
import { usePatientHistory } from '@/hooks/usePatientHistory';
import PatientSelector from './patient/PatientSelector';
import PatientInfo from './patient/PatientInfo';
import MedicalRecordDialog from './patient/MedicalRecordDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

              <Tabs defaultValue="medicalHistory" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="medicalHistory">Histórico de Consultas</TabsTrigger>
                  <TabsTrigger value="prescriptions">Receitas</TabsTrigger>
                  <TabsTrigger value="measurements">Sinais Vitais</TabsTrigger>
                </TabsList>

                <TabsContent value="medicalHistory">
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
                </TabsContent>

                <TabsContent value="prescriptions">
                  {(selectedPatient.medicalHistory && selectedPatient.medicalHistory.filter(r => r.prescription).length > 0) ? (
                    <div className="space-y-4">
                      {selectedPatient.medicalHistory.filter(r => r.prescription).map((record) => (
                        <div 
                          key={record.id} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="mb-2 flex justify-between items-center">
                            <div className="font-medium">{record.doctor}</div>
                            <div className="text-sm text-gray-600">{formatDate(record.date)}</div>
                          </div>
                          <div className="border-t pt-3 mt-2 whitespace-pre-wrap">
                            <p className="font-medium mb-2">Prescrição:</p>
                            <p>{record.prescription}</p>
                            
                            {record.observation && (
                              <>
                                <p className="font-medium mt-3 mb-2">Observação:</p>
                                <p>{record.observation}</p>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Não há receitas médicas para este paciente
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="measurements">
                  {(selectedPatient.medicalHistory && selectedPatient.medicalHistory.filter(r => r.measurements).length > 0) ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Temperatura</TableHead>
                          <TableHead>Batimentos</TableHead>
                          <TableHead>Pressão</TableHead>
                          <TableHead>Saturação</TableHead>
                          <TableHead>Glicemia</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPatient.medicalHistory.filter(r => r.measurements).map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.date)}</TableCell>
                            <TableCell>{record.measurements?.temperature ? `${record.measurements.temperature}°C` : '-'}</TableCell>
                            <TableCell>{record.measurements?.heartRate ? `${record.measurements.heartRate} BPM` : '-'}</TableCell>
                            <TableCell>{record.measurements?.bloodPressure || '-'}</TableCell>
                            <TableCell>{record.measurements?.oxygenSaturation ? `${record.measurements.oxygenSaturation}%` : '-'}</TableCell>
                            <TableCell>{record.measurements?.glucoseLevel ? `${record.measurements.glucoseLevel} mg/dL` : '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Não há registros de sinais vitais para este paciente
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
