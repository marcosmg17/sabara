
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ContactForm = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada",
      description: "Entraremos em contato em breve!",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" required placeholder="Seu nome completo" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required placeholder="seu.email@exemplo.com" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" type="tel" placeholder="(11) 99999-9999" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Assunto</Label>
        <Input id="subject" required placeholder="Assunto da mensagem" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea 
          id="message" 
          required 
          placeholder="Digite sua mensagem aqui..."
          className="min-h-[150px]"
        />
      </div>
      
      <Button type="submit" className="w-full">Enviar Mensagem</Button>
    </form>
  );
};

export default ContactForm;
