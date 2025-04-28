
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { File, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExamUploadProps {
  onUpload: (data: { userId: string; examName: string; file: File }) => void;
}

const ExamUpload: React.FC<ExamUploadProps> = ({ onUpload }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [examName, setExamName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  // Load users from localStorage on component mount
  useEffect(() => {
    // Get users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('All users from localStorage:', storedUsers);
    
    // All users in the localStorage are considered to have accounts
    setUsers(storedUsers);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo PDF",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !examName || !selectedFile) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    onUpload({
      userId: selectedUser,
      examName,
      file: selectedFile,
    });

    setSelectedUser('');
    setExamName('');
    setSelectedFile(null);
    
    toast({
      title: "Sucesso",
      description: "Exame enviado com sucesso",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5" />
          Enviar Resultado de Exame
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Paciente</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent>
                {users.length === 0 ? (
                  <SelectItem value="none" disabled>Nenhum paciente disponível</SelectItem>
                ) : (
                  users.map((user) => (
                    <SelectItem 
                      key={user.id || user.email} 
                      value={user.id ? user.id.toString() : user.email}
                    >
                      {user.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="examName">Nome do Exame</Label>
            <Input
              id="examName"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Ex: Hemograma"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Arquivo PDF</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          <Button type="submit" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Enviar Exame
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExamUpload;
