
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Mail, Bell, Check } from 'lucide-react';

const DigitalCommunication: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState('whatsapp');
  
  const handleSubscribe = () => {
    // Simulate subscription process
    setTimeout(() => {
      setIsSubscribed(true);
    }, 1000);
  };

  const notificationTypes = [
    { id: 1, name: 'Resultados de Exames', enabled: true },
    { id: 2, name: 'Consultas e Agendamentos', enabled: true },
    { id: 3, name: 'Medicações e Tratamentos', enabled: true },
    { id: 4, name: 'Lembretes de Consulta', enabled: true },
    { id: 5, name: 'Informações sobre Alta', enabled: true },
    { id: 6, name: 'Boletins Médicos', enabled: false },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Comunicação Digital Integrada</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Receba todas as informações sobre seu atendimento, alta e resultados de exames diretamente no seu celular
            ou e-mail. Mantenha-se sempre informado sobre seu tratamento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Demo Mobile Phone */}
          <div className="relative mx-auto">
            <div className="w-64 h-[500px] bg-gray-800 rounded-[36px] p-3 mx-auto shadow-xl">
              <div className="bg-white h-full w-full rounded-[28px] overflow-hidden flex flex-col">
                {/* Notification Header */}
                <div className="bg-sabara-primary text-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Hospital className="h-6 w-6" />
                    <h3 className="font-semibold">Hospital Sabara Health</h3>
                  </div>
                  <p className="text-sm">Centro de Notificações</p>
                </div>
                
                {/* Notification Content */}
                <div className="flex-1 overflow-auto p-3 space-y-3">
                  {activeTab === 'whatsapp' ? (
                    <>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">Sabara Health</span>
                          <span className="text-xs text-gray-500">09:45</span>
                        </div>
                        <p className="text-sm">Olá Ana, seu exame de sangue está pronto! Você já pode acessar os resultados pelo aplicativo ou retirar no hospital.</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">Sabara Health</span>
                          <span className="text-xs text-gray-500">Ontem</span>
                        </div>
                        <p className="text-sm">Lembrete: Sua consulta com Dr. Ricardo Matos (Cardiologia) está agendada para amanhã às 14:30. Por favor, confirme sua presença.</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">Sabara Health</span>
                          <span className="text-xs text-gray-500">05/05</span>
                        </div>
                        <p className="text-sm">Ana, seu pedido de renovação de receita foi aprovado. Você já pode retirar na recepção do hospital.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">Aplicativo Sabara</span>
                          <span className="text-xs text-gray-500">Agora</span>
                        </div>
                        <p className="text-sm">Seu tempo estimado de espera foi atualizado: 15 minutos</p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">Resultados de Exames</span>
                          <span className="text-xs text-gray-500">2h atrás</span>
                        </div>
                        <p className="text-sm">Seu exame de Hemograma Completo já está disponível para visualização.</p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">Medicações</span>
                          <span className="text-xs text-gray-500">6h atrás</span>
                        </div>
                        <p className="text-sm">Lembrete: Hora de tomar seu medicamento prescrito pelo Dr. Paulo.</p>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Mobile Navigation */}
                <div className="h-10 bg-gray-100 flex justify-center items-center">
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-transparent">
                      <TabsTrigger value="whatsapp" className="h-8 w-8 p-0">
                        <Smartphone className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="app" className="h-8 w-8 p-0">
                        <Bell className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
            
            {/* Notification badges */}
            <div className="absolute top-1/4 -right-8 bg-white p-4 rounded-full shadow-lg animate-pulse-slow">
              <Bell className="h-6 w-6 text-sabara-primary" />
            </div>
            <div className="absolute bottom-1/4 -left-8 bg-white p-4 rounded-full shadow-lg animate-pulse-slow">
              <Mail className="h-6 w-6 text-sabara-primary" />
            </div>
          </div>

          {/* Control Panel */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-sabara-primary">Configure suas notificações</CardTitle>
            </CardHeader>
            <CardContent>
              {isSubscribed ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-green-800">Você está inscrito para receber notificações!</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Gerenciar tipos de notificações:</h3>
                    <div className="space-y-3">
                      {notificationTypes.map((type) => (
                        <div key={type.id} className="flex items-center justify-between">
                          <span className="text-gray-700">{type.name}</span>
                          <Switch checked={type.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSubscribed(false)}
                    className="w-full border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Cancelar inscrição
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p>
                    Receba notificações sobre seu atendimento, resultados de exames e lembretes importantes.
                    Inscreva-se informando seu número de WhatsApp ou e-mail:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input 
                        id="phone" 
                        placeholder="(11) 99999-9999" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" placeholder="seuemail@example.com" />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-sabara-primary hover:bg-sabara-primary/90"
                    onClick={handleSubscribe}
                  >
                    Inscrever-se
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Missing component imports
const Hospital = Smartphone;

// Simple Switch component since we're not importing shadcn's switch
const Switch = ({ checked }: { checked: boolean }) => (
  <div className={`w-10 h-5 rounded-full p-1 ${checked ? 'bg-sabara-primary' : 'bg-gray-300'}`}>
    <div 
      className={`bg-white w-3 h-3 rounded-full transform duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} 
    />
  </div>
);

export default DigitalCommunication;
