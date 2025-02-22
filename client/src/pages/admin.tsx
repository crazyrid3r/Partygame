import { useState } from "react";
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

const ADMIN_PASSWORD = 'party2025';

type QuestionType = 'truth' | 'dare';
type GameMode = 'kids' | 'normal' | 'spicy';

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedType, setSelectedType] = useState<QuestionType>('truth');
  const [selectedMode, setSelectedMode] = useState<GameMode>('normal');

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

    // Hier später: Frage zur Datenbank hinzufügen
    toast({
      title: "Erfolg",
      description: "Frage/Aufgabe wurde hinzugefügt",
    });
    setNewQuestion("");
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

            {/* Hier später: Liste der vorhandenen Fragen/Aufgaben mit Bearbeitungsmöglichkeit */}
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
