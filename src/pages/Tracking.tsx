
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Bell, User, Stethoscope, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Tracking = () => {
  const [ticketData, setTicketData] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState('waiting-triage');
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [showNotification, setShowNotification] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const ticket = localStorage.getItem('currentTicket');
    if (ticket) {
      setTicketData(JSON.parse(ticket));
    }

    // Simulate status updates
    const statusInterval = setInterval(() => {
      setCurrentStatus(prev => {
        switch (prev) {
          case 'waiting-triage':
            setTimeout(() => showCallNotification('triagem'), 8000);
            return 'in-triage';
          case 'in-triage':
            return 'waiting-doctor';
          case 'waiting-doctor':
            setTimeout(() => showCallNotification('médico'), 12000);
            return 'in-consultation';
          case 'in-consultation':
            return 'completed';
          default:
            return prev;
        }
      });
    }, 20000);

    return () => clearInterval(statusInterval);
  }, []);

  const showCallNotification = (type: string) => {
    setShowNotification(true);
    toast({
      title: `🔔 Você foi chamado!`,
      description: `Dirija-se à ${type === 'triagem' ? 'sala de triagem' : 'consultório médico'}.`,
    });
    
    // Auto-hide notification after 10 seconds
    setTimeout(() => setShowNotification(false), 10000);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'waiting-triage':
        return { 
          label: 'Aguardando Triagem', 
          icon: Clock, 
          color: 'bg-yellow-500',
          description: 'Você está na fila para triagem com enfermagem'
        };
      case 'in-triage':
        return { 
          label: 'Em Triagem', 
          icon: User, 
          color: 'bg-blue-500',
          description: 'A enfermagem está realizando sua triagem'
        };
      case 'waiting-doctor':
        return { 
          label: 'Aguardando Médico', 
          icon: Clock, 
          color: 'bg-orange-500',
          description: 'Aguardando chamada para consulta médica'
        };
      case 'in-consultation':
        return { 
          label: 'Em Consulta', 
          icon: Stethoscope, 
          color: 'bg-green-500',
          description: 'Você está sendo atendido pelo médico'
        };
      case 'completed':
        return { 
          label: 'Atendimento Concluído', 
          icon: CheckCircle, 
          color: 'bg-gray-500',
          description: 'Seu atendimento foi finalizado'
        };
      default:
        return { 
          label: 'Status Desconhecido', 
          icon: Clock, 
          color: 'bg-gray-500',
          description: ''
        };
    }
  };

  const statusInfo = getStatusInfo(currentStatus);
  const StatusIcon = statusInfo.icon;

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <p>Nenhuma senha encontrada. Faça o check-in primeiro.</p>
            <Button className="mt-4">Voltar ao Check-in</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Notification Banner */}
        {showNotification && (
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg animate-pulse">
            <div className="flex items-center">
              <Bell className="w-6 h-6 mr-3" />
              <div>
                <h3 className="font-bold">🔔 VOCÊ FOI CHAMADO!</h3>
                <p className="text-sm">Dirija-se ao local indicado</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sabara-primary">Acompanhe seu Atendimento</h1>
          <p className="text-gray-600">Sua senha: <span className="font-bold">{ticketData.number}</span></p>
        </div>

        {/* Current Status */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <StatusIcon className="w-6 h-6 mr-2" />
              Status Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${statusInfo.color} text-white text-center`}>
              <h3 className="text-xl font-bold">{statusInfo.label}</h3>
              <p className="text-sm mt-1">{statusInfo.description}</p>
            </div>
            
            {currentStatus !== 'completed' && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Tempo estimado:</p>
                <p className="text-lg font-semibold">{estimatedTime} minutos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Triagem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Prioridade:</span>
                <Badge className={ticketData.color}>
                  {ticketData.priority}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Chegada:</span>
                <span className="text-sm">
                  {new Date(ticketData.timestamp).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso do Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: 'waiting-triage', label: 'Aguardando Triagem' },
                { status: 'in-triage', label: 'Em Triagem' },
                { status: 'waiting-doctor', label: 'Aguardando Médico' },
                { status: 'in-consultation', label: 'Em Consulta' },
                { status: 'completed', label: 'Concluído' }
              ].map((step, index) => {
                const isActive = step.status === currentStatus;
                const isCompleted = ['waiting-triage', 'in-triage', 'waiting-doctor', 'in-consultation', 'completed']
                  .indexOf(currentStatus) >= index;
                
                return (
                  <div key={step.status} className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    } ${isActive ? 'ring-4 ring-green-200' : ''}`} />
                    <span className={`ml-3 ${isActive ? 'font-bold text-green-600' : ''}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Instruções:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Mantenha seu celular por perto</li>
              <li>• Você receberá notificações quando for chamado</li>
              <li>• Permaneça na área de espera</li>
              <li>• Em caso de emergência, procure a recepção</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tracking;
