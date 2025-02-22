import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Question } from "@shared/schema";
import { Edit2, Trash2, Download, Upload } from "lucide-react";

const ADMIN_PASSWORD = 'party2025';

type QuestionType = 'truth' | 'dare';
type GameMode = 'kids' | 'normal' | 'spicy';

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionEn, setNewQuestionEn] = useState("");
  const [selectedType, setSelectedType] = useState<QuestionType>('truth');
  const [selectedMode, setSelectedMode] = useState<GameMode>('normal');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const { data: questions } = useQuery<Question[]>({
    queryKey: [`/api/questions/${selectedType}/${selectedMode}`],
    enabled: isAuthenticated,
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (question: { type: string; mode: string; content: string; content_en: string }) => {
      return apiRequest('POST', '/api/questions', question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/questions/${selectedType}/${selectedMode}`] });
      toast({
        title: "Erfolg",
        description: "Frage/Aufgabe wurde hinzugefügt",
      });
      setNewQuestion("");
      setNewQuestionEn("");
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, ...question }: { id: number; content: string; content_en: string }) => {
      return apiRequest('PATCH', `/api/questions/${id}`, question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/questions/${selectedType}/${selectedMode}`] });
      toast({
        title: "Erfolg",
        description: "Frage/Aufgabe wurde aktualisiert",
      });
      setEditingQuestion(null);
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/questions/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/questions/${selectedType}/${selectedMode}`] });
      toast({
        title: "Erfolg",
        description: "Frage/Aufgabe wurde gelöscht",
      });
    },
  });

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Erfolgreich eingeloggt",
        description: "Willkommen im Admin-Bereich",
      });
    } else {
      toast({
        title: "Falsches Passwort",
        description: "Bitte versuchen Sie es erneut",
        variant: "destructive",
      });
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || !newQuestionEn.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie die Frage oder Aufgabe in beiden Sprachen ein",
        variant: "destructive",
      });
      return;
    }

    addQuestionMutation.mutate({
      type: selectedType,
      mode: selectedMode,
      content: newQuestion.trim(),
      content_en: newQuestionEn.trim(),
    });
  };

  const handleUpdateQuestion = (question: Question) => {
    updateQuestionMutation.mutate({
      id: question.id,
      content: editingQuestion?.content || question.content,
      content_en: editingQuestion?.content_en || question.content_en,
    });
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/questions/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'questions.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: "Die Fragen konnten nicht exportiert werden",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/questions/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: [`/api/questions/${selectedType}/${selectedMode}`] });
        toast({
          title: "Import erfolgreich",
          description: `${result.success} Fragen importiert, ${result.failed} fehlgeschlagen`,
        });
      } else {
        throw new Error(result.error || 'Import fehlgeschlagen');
      }
    } catch (error: any) {
      toast({
        title: "Import fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    }

    // Reset das Datei-Input
    event.target.value = '';
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">
                Einloggen
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                className="w-full"
              >
                Zurück zum Spiel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">Fragen und Aufgaben verwalten</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as QuestionType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Typ auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truth">Wahrheit</SelectItem>
                  <SelectItem value="dare">Pflicht</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedMode}
                onValueChange={(value) => setSelectedMode(value as GameMode)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Modus auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kids">Kinder</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="spicy">Spicy</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <label className="cursor-pointer">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Import
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Neue Frage oder Aufgabe auf Deutsch eingeben"
                />
                <Input
                  value={newQuestionEn}
                  onChange={(e) => setNewQuestionEn(e.target.value)}
                  placeholder="Enter new question or dare in English"
                />
                <Button onClick={handleAddQuestion} className="w-full">Hinzufügen</Button>
              </div>
            </div>

            <div className="space-y-4">
              {questions?.map((question) => (
                <div
                  key={question.id}
                  className="space-y-2 p-4 bg-muted rounded-lg"
                >
                  {editingQuestion?.id === question.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editingQuestion.content}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, content: e.target.value })
                        }
                        placeholder="Deutsche Version"
                      />
                      <Input
                        value={editingQuestion.content_en || ''}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, content_en: e.target.value })
                        }
                        placeholder="English Version"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateQuestion(question)}
                        >
                          Speichern
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingQuestion(null)}
                        >
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">🇩🇪 {question.content}</p>
                      <p className="text-muted-foreground">🇬🇧 {question.content_en}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingQuestion(question)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteQuestionMutation.mutate(question.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="w-full"
            >
              Zurück zum Spiel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}