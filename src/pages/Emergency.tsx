
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, AlertTriangle, Ambulance, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Emergency = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="bg-red-500 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-12 w-12 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold mb-2">Emergências</h1>
                  <p className="text-xl">Atendimento 24 horas</p>
                </div>
              </div>
              <Button 
                size="lg"
                className="bg-white text-red-500 hover:bg-red-50"
                onClick={() => window.location.href = 'tel:11-3003-1234'}
              >
                <Phone className="mr-2" />
                (11) 3003-1234
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-sabara-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Contato Emergencial</h3>
                <p className="text-gray-600 mb-4">Nossa central de emergência está disponível 24 horas por dia.</p>
                <Button className="w-full" onClick={() => window.location.href = 'tel:11-3003-1234'}>
                  Ligar Agora
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Ambulance className="h-12 w-12 text-sabara-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Remoção</h3>
                <p className="text-gray-600 mb-4">Serviço de ambulância para emergências e remoções.</p>
                <Button variant="outline" className="w-full">
                  Solicitar Ambulância
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-sabara-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Pronto Socorro</h3>
                <p className="text-gray-600 mb-4">Atendimento de urgência e emergência 24 horas.</p>
                <Button variant="outline" className="w-full">
                  Como Chegar
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Quando Procurar o Pronto Socorro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Casos de Emergência</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Dor no peito intensa</li>
                  <li>Dificuldade respiratória grave</li>
                  <li>Acidentes graves</li>
                  <li>Perda de consciência</li>
                  <li>Queimaduras graves</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Casos de Urgência</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Febre alta persistente</li>
                  <li>Cortes que necessitam de sutura</li>
                  <li>Trauma leve</li>
                  <li>Crises alérgicas</li>
                  <li>Dores intensas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Emergency;
