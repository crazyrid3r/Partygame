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
  const [selectedType, setSelectedType] = useState<QuestionType>('truth');
  const [selectedMode, setSelectedMode] = useState<GameMode>('normal');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const { data: questions } = useQuery<Question[]>({
    queryKey: ['/api/questions', selectedType, selectedMode],
    enabled: isAuthenticated,
  });

  const addQuestionMutation = useMutation({
    mutationFn: async (question: { type: string; mode: string; content: string }) => {
      return apiRequest('POST', '/api/questions', question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
      toast({
        title: "Erfolg",
        description: "Frage/Aufgabe wurde hinzugefügt",
      });
      setNewQuestion("");
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, ...question }: { id: number; content: string }) => {
      return apiRequest('PATCH', `/api/questions/${id}`, question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
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
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
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
    if (!newQuestion.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine Frage oder Aufgabe ein",
        variant: "destructive",
      });
      return;
    }

    addQuestionMutation.mutate({
      type: selectedType,
      mode: selectedMode,
      content: newQuestion.trim(),
    });
  };

  const handleUpdateQuestion = (question: Question) => {
    updateQuestionMutation.mutate({
      id: question.id,
      content: editingQuestion?.content || question.content,
    });
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
            </div>

            <div className="flex gap-2">
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Neue Frage oder Aufgabe eingeben"
              />
              <Button onClick={handleAddQuestion}>Hinzufügen</Button>
            </div>

            <div className="space-y-4">
              {questions?.map((question) => (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  {editingQuestion?.id === question.id ? (
                    <Input
                      value={editingQuestion.content}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, content: e.target.value })
                      }
                    />
                  ) : (
                    <p>{question.content}</p>
                  )}
                  <div className="flex gap-2">
                    {editingQuestion?.id === question.id ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingQuestion(question)}
                        >
                          Bearbeiten
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteQuestionMutation.mutate(question.id)}
                        >
                          Löschen
                        </Button>
                      </>
                    )}
                  </div>
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