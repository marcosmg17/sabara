
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, User } from 'lucide-react';
import { Nurse, NurseStatus } from '@/types/nurse';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface NurseInfoCardProps {
  nurse: Nurse;
}

const NurseInfoCard: React.FC<NurseInfoCardProps> = ({ nurse }) => {
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
          Enfermeiro(a) de plantão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          {nurse.imageUrl ? (
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={nurse.imageUrl} 
                alt={nurse.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-sabara-primary text-white flex items-center justify-center text-xl font-bold">
              {nurse.name?.[0]}
            </div>
          )}
          <div className="ml-4">
            <h3 className="font-medium">{nurse.name}</h3>
            <p className="text-sm text-gray-600">
              {nurse.room && `Sala ${nurse.room}`}
              {nurse.specialty && ` • ${nurse.specialty}`}
            </p>
            <div className="mt-1 flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Badge className={`${getStatusColor(nurse.status || 'offline')} cursor-pointer`}>
                    {getStatusLabel(nurse.status || 'offline')}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Status do Enfermeiro</h4>
                    <p className="text-sm text-gray-600">
                      {nurse.status === 'busy' ? 
                        'Este enfermeiro está atualmente realizando uma triagem.' : 
                        getStatusLabel(nurse.status || 'offline')}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Badge className={nurse.available ? "bg-green-500" : "bg-red-500"}>
                {nurse.available ? "Disponível para atendimento" : "Indisponível para atendimento"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NurseInfoCard;
