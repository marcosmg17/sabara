
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Ticket, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Checkin = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [priority, setPriority] = useState('');
  const [priorityColor, setPriorityColor] = useState('');
  const [showTicket, setShowTicket] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const simulateQRScan = () => {
    setIsScanning(true);
    
    // Simulate QR code scanning delay
    setTimeout(() => {
      const preTriageData = localStorage.getItem('currentPreTriage');
      
      if (preTriageData) {
        const data = JSON.parse(preTriageData);
        const newTicketNumber = `A${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
        
        setTicketNumber(newTicketNumber);
        setPriority(data.priority);
        setPriorityColor(data.color);
        
        // Save ticket data
        const ticketData = {
          number: newTicketNumber,
          priority: data.priority,
          color: data.color,
          timestamp: new Date().toISOString(),
          status: 'waiting-triage',
          triageData: data
        };
        
        localStorage.setItem('currentTicket', JSON.stringify(ticketData));
        
        setIsScanning(false);
        setShowTicket(true);
        
        toast({
          title: "Check-in realizado!",
          description: `Sua senha é ${newTicketNumber}. Acompanhe o status pelo celular.`
        });
      } else {
        setIsScanning(false);
        toast({
          variant: "destructive",
          title: "QR Code inválido",
          description: "Faça sua pré-triagem primeiro."
        });
      }
    }, 2000);
  };

  const goToTracking = () => {
    navigate('/tracking');
  };

  const goToPreTriage = () => {
    navigate('/pre-triage');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        
        {!showTicket ? (
          <Card className="shadow-2xl border-4 border-sabara-primary">
            <CardHeader className="text-center bg-sabara-primary text-white">
              <CardTitle className="text-2xl">Check-in - Totem</CardTitle>
              <p className="text-sabara-secondary">Escaneie seu QR Code da pré-triagem</p>
            </CardHeader>
            <CardContent className="text-center py-8">
              {!isScanning ? (
                <div className="space-y-6">
                  <QrCode className="w-24 h-24 mx-auto text-sabara-primary" />
                  <h3 className="text-xl font-semibold">Posicione seu QR Code</h3>
                  <p className="text-gray-600">
                    Aponte a tela do seu celular para a câmera do totem
                  </p>
                  <Button 
                    size="lg" 
                    className="w-full bg-sabara-primary hover:bg-sabara-primary/90 h-16 text-lg"
                    onClick={simulateQRScan}
                  >
                    <QrCode className="w-6 h-6 mr-2" />
                    Simular Scan QR Code
                  </Button>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-2">Ainda não fez a pré-triagem?</p>
                    <Button variant="outline" onClick={goToPreTriage}>
                      Fazer Pré-Triagem
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="animate-pulse">
                    <QrCode className="w-24 h-24 mx-auto text-sabara-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Escaneando...</h3>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sabara-primary"></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-2xl border-4 border-green-500">
            <CardHeader className="text-center bg-green-500 text-white">
              <CardTitle className="text-2xl">Check-in Realizado!</CardTitle>
              <p>Sua senha foi gerada com sucesso</p>
            </CardHeader>
            <CardContent className="text-center py-8 space-y-6">
              <div className={`p-6 rounded-lg ${priorityColor} text-white`}>
                <Ticket className="w-12 h-12 mx-auto mb-2" />
                <h2 className="text-4xl font-bold">{ticketNumber}</h2>
                <p className="text-lg">Prioridade: {priority}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Aguarde ser chamado. Você pode acompanhar o status pelo seu celular.
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="w-full bg-sabara-primary hover:bg-sabara-primary/90"
                onClick={goToTracking}
              >
                Acompanhar Status no Celular
              </Button>
              
              <div className="text-xs text-gray-500">
                <p>Mantenha seu celular por perto para receber notificações</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Checkin;
