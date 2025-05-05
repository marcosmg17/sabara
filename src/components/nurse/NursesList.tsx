
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Nurse, NurseStatus } from '@/types/nurse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NursesListProps {
  nurses: Nurse[];
}

const NursesList: React.FC<NursesListProps> = ({ nurses }) => {
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
  
  const availableNurses = nurses.filter(nurse => nurse.available);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipe de Enfermagem</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium text-sm text-gray-500">
            {availableNurses.length} de {nurses.length} enfermeiros disponíveis
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enfermeiro(a)</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Disponibilidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nurses.map((nurse) => (
              <TableRow key={nurse.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-sabara-primary text-white flex items-center justify-center text-sm font-bold mr-2">
                      {nurse.name?.[0]}
                    </div>
                    {nurse.name}
                  </div>
                </TableCell>
                <TableCell>{nurse.room}</TableCell>
                <TableCell>{nurse.specialty || "Geral"}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(nurse.status || 'offline')}>
                    {getStatusLabel(nurse.status || 'offline')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={nurse.available ? "bg-green-500" : "bg-red-500"}>
                    {nurse.available ? "Disponível" : "Indisponível"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NursesList;
