
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Stethoscope } from 'lucide-react';
import { Nurse, NurseStatus } from '@/types/nurse';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface NurseProfileCardProps {
  nurse: Nurse;
  onStatusChange: (status: NurseStatus) => void;
  onAvailabilityChange: (available: boolean) => void;
}

const NurseProfileCard: React.FC<NurseProfileCardProps> = ({ 
  nurse, 
  onStatusChange,
  onAvailabilityChange
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<NurseStatus>(nurse.status || 'available');

  const handleStatusChange = (newStatus: NurseStatus) => {
    setStatus(newStatus);
    onStatusChange(newStatus);
    
    toast({
      title: "Status atualizado",
      description: `Seu status foi alterado para ${getStatusLabel(newStatus)}`,
    });
  };

  const handleAvailabilityToggle = (checked: boolean) => {
    onAvailabilityChange(checked);
    
    toast({
      title: checked ? "Disponível para atendimentos" : "Indisponível para atendimentos",
      description: checked ? "Você será notificado de novos pacientes" : "Você não receberá novos pacientes",
    });
  };

  const getStatusLabel = (status: NurseStatus) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'busy': return 'Em atendimento';
      case 'away': return 'Ausente';
      case 'offline': return 'Offline';
      default: return 'Desconhecido';
    }
  };

  const getStatusColor = (status: NurseStatus) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-orange-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Meu Perfil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-sabara-primary text-white flex items-center justify-center text-xl font-bold">
            {nurse.name?.[0]}
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="font-medium">{nurse.name}</h3>
            <p className="text-sm text-gray-600">{nurse.room && `Sala ${nurse.room}`}</p>
            <Badge className={`mt-1 ${getStatusColor(status)}`}>
              {getStatusLabel(status)}
            </Badge>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => handleStatusChange(value as NurseStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione seu status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="busy">Em atendimento</SelectItem>
                <SelectItem value="away">Ausente</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="available">Disponível para novos atendimentos</Label>
            <Switch 
              id="available"
              checked={nurse.available} 
              onCheckedChange={handleAvailabilityToggle}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 text-sm text-gray-500">
        Última atualização: {new Date().toLocaleTimeString()}
      </CardFooter>
    </Card>
  );
};

export default NurseProfileCard;
