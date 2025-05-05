
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ClipboardList, FileText, HeartPulse, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface PatientHistoryRecord {
  id: number;
  date: string;
  doctor: string;
  notes: string;
  prescription?: string;
  measurements?: any;
}

interface Triage {
  id: number;
  date: string;
  symptoms: string[];
  priority: string;
  recommendation: string;
  preTriageNotes?: string;
}

const PatientHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const currentUserStr = sessionStorage.getItem('currentUser');
    
    if (!currentUserStr) {
      navigate('/login');
      return;
    }
    
    try {
      const currentUser = JSON.parse(currentUserStr);
      setUser(currentUser);
    } catch (error) {
      console.error('Error parsing user data', error);
      sessionStorage.removeItem('currentUser');
      navigate('/login');
    }
  }, [navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sabara-primary"></div>
      </div>
    );
  }

  const medicalHistory: PatientHistoryRecord[] = user.medicalHistory || [];
  const triageHistory: Triage[] = user.triageHistory || [];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-sabara-primary mb-8">Histórico Completo</h1>
          
          <Tabs defaultValue="medical">
            <TabsList className="mb-6">
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Histórico Médico
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Receitas
              </TabsTrigger>
              <TabsTrigger value="vitals" className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4" />
                Sinais Vitais
              </TabsTrigger>
              <TabsTrigger value="triage" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Triagens
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="medical">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Consultas Médicas</CardTitle>
                </CardHeader>
                <CardContent>
                  {medicalHistory.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Médico</TableHead>
                          <TableHead>Diagnóstico</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {medicalHistory.map((record) => (
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
                      Não há registros médicos disponíveis
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prescriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Receitas Médicas</CardTitle>
                </CardHeader>
                <CardContent>
                  {medicalHistory.filter(r => r.prescription).length > 0 ? (
                    <div className="space-y-4">
                      {medicalHistory.filter(r => r.prescription).map((record) => (
                        <div 
                          key={record.id} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="mb-2 flex justify-between items-center">
                            <div className="font-medium">{record.doctor}</div>
                            <div className="text-sm text-gray-600">{formatDate(record.date)}</div>
                          </div>
                          <div className="border-t pt-3 mt-2 whitespace-pre-wrap">{record.prescription}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Não há receitas médicas disponíveis
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="vitals">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Sinais Vitais</CardTitle>
                </CardHeader>
                <CardContent>
                  {medicalHistory.filter(r => r.measurements).length > 0 ? (
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
                        {medicalHistory.filter(r => r.measurements).map((record) => (
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
                      Não há registros de sinais vitais disponíveis
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="triage">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Triagens</CardTitle>
                </CardHeader>
                <CardContent>
                  {triageHistory.length > 0 ? (
                    <div className="space-y-4">
                      {triageHistory.map((triage) => (
                        <div 
                          key={triage.id} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="mb-3 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              {formatDate(triage.date)}
                            </div>
                            <Badge className={
                              triage.priority === 'Crítico' ? 'bg-red-500' :
                              triage.priority === 'Alto' ? 'bg-orange-500' :
                              triage.priority === 'Moderado' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }>
                              Prioridade: {triage.priority}
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-1">Sintomas reportados:</div>
                            <div className="flex flex-wrap gap-2">
                              {triage.symptoms.map((symptom, index) => (
                                <span 
                                  key={index} 
                                  className="bg-sabara-secondary/50 text-gray-700 px-2 py-1 rounded-md text-xs"
                                >
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {triage.preTriageNotes && (
                            <div className="mb-3">
                              <div className="text-sm font-medium mb-1">Observações da pré-triagem:</div>
                              <p className="text-sm text-gray-700">{triage.preTriageNotes}</p>
                            </div>
                          )}
                          
                          <div>
                            <div className="text-sm font-medium mb-1">Recomendação:</div>
                            <p className="text-sm text-gray-700">{triage.recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Não há registros de triagem disponíveis
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PatientHistory;
