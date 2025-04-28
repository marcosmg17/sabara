
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

interface Appointment {
  id: number;
  date: string;
  doctor: string;
  specialty: string;
  status: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };


  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'agendado':
        return 'bg-blue-500';
      case 'realizado':
        return 'bg-green-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-sabara-primary flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Suas Consultas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-500">Você não possui consultas agendadas.</p>
            <Button className="mt-4 bg-sabara-primary hover:bg-sabara-primary/90">
              Agendar Consulta
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div className="flex items-start space-x-3">
                    <div className="bg-sabara-secondary/30 rounded-lg p-2 flex flex-col items-center justify-center min-w-[60px]">
                      <span className="font-bold text-sabara-primary">
                        {formatDate(appointment.date).split('/')[0]}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(appointment.date).toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="font-semibold">{appointment.doctor}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full text-white ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{appointment.specialty}</div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {formatTime(appointment.date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    {appointment.status === 'Agendado' ? (
                      <>
                        <Button variant="outline" size="sm">
                          Remarcar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 border-red-500 hover:bg-red-50"
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-sabara-primary text-sabara-primary hover:bg-sabara-primary hover:text-white"
                      >
                        Ver Detalhes
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <Button className="bg-sabara-primary hover:bg-sabara-primary/90">
                Agendar Nova Consulta
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentList;
