
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {

    sessionStorage.removeItem('currentUser');
    
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso.",
    });
    

    navigate('/');
  };

  return (
    <div className="bg-white shadow-sm py-6 px-4 mb-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Olá, {userName}!</h1>
            <p className="text-gray-600">Bem-vindo(a) ao seu painel de saúde</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
