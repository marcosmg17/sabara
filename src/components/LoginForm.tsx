
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital } from 'lucide-react';

const LoginForm: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="bg-sabara-primary rounded-full p-3 mb-2 mx-auto w-fit">
          <Hospital className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Sistema Smart Care</CardTitle>
        <CardDescription className="text-center">
          Sistema integrado de gestão hospitalar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Acesse o sistema usando suas credenciais
          </p>
          <Button asChild className="w-full bg-sabara-primary hover:bg-sabara-primary/90">
            <Link to="/">
              Fazer Login
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
