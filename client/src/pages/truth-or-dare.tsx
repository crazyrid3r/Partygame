import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Question } from "@shared/schema";
import { NicknameGenerator } from "@/components/nickname-generator";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/loading-screen";
import { useTranslation } from "@/lib/i18n";
import { LanguageContext } from "@/lib/i18n";

type GameMode = 'kids' | 'normal' | 'spicy';

export default function TruthOrDare() {
  const { user } = useAuth();
  const { language } = useContext(LanguageContext);
  const t = useTranslation();
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [newPlayer, setNewPlayer] = useState("");
  const [challenge, setChallenge] = useState<string | null>(null);
  const [playerScores, setPlayerScores] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: truthQuestions, isLoading: truthLoading } = useQuery<Question[]>({
    queryKey: [`/api/questions/truth/${gameMode}`],
    enabled: !!gameMode,
  });

  const { data: dareQuestions, isLoading: dareLoading } = useQuery<Question[]>({
    queryKey: [`/api/questions/dare/${gameMode}`],
    enabled: !!gameMode,
  });

  const selectGameMode = (mode: GameMode) => {
    setGameMode(mode);
  };

  const handlePlayerCountSubmit = (count: number) => {
    if (count > 0) {
      setPlayerCount(count);
      setPlayers([]); 
      setPlayerScores({}); 
    }
  };

  const addPlayer = (playerName: string = newPlayer) => {
    if (players.length < playerCount!) {
      const trimmedName = playerName.trim();
      if (trimmedName) {
        setPlayers(prev => [...prev, trimmedName]);
        setPlayerScores(prev => ({ ...prev, [trimmedName]: 0 }));
        setNewPlayer(""); 
      }
    }
  };

  const handleAddCurrentUser = () => {
    if (user && players.length < playerCount!) {
      addPlayer(user.username);
    }
  };

  const handleChallenge = async (type: "truth" | "dare") => {
    if (!gameMode) return;

    setIsTransitioning(true);
    const questions = type === "truth" ? truthQuestions : dareQuestions;
    if (!questions?.length) {
      toast({
        title: "Fehler",
        description: `Keine ${type === "truth" ? "Wahrheit" : "Pflicht"}-Fragen für diesen Modus verfügbar.`,
        variant: "destructive",
      });
      setIsTransitioning(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    // Use the appropriate content based on the selected language
    setChallenge(language === 'en' && randomQuestion.content_en ? randomQuestion.content_en : randomQuestion.content);
    setIsTransitioning(false);
  };

  const handleCompleteChallenge = async () => {
    const currentPlayerName = players[currentPlayer];
    const currentScore = (playerScores[currentPlayerName] || 0) + 5;
    setPlayerScores({ ...playerScores, [currentPlayerName]: currentScore });

    if (user && currentPlayerName === user.username) {
      try {
        await apiRequest("POST", "/api/scores", {
          playerName: user.username,
          points: 5,
          userId: user.id,
          gameType: 'Truth or Dare'
        });

        toast({
          title: "Punkte gespeichert",
          description: "+5 Punkte für das Erfüllen der Aufgabe",
        });
      } catch (error) {
        console.error("Failed to save score:", error);
        toast({
          title: "Fehler",
          description: "Punkte konnten nicht gespeichert werden",
          variant: "destructive",
        });
      }
    }

    setChallenge(null);
    setCurrentPlayer((current) => (current + 1) % players.length);
  };

  const handleSkipChallenge = async () => {
    const currentPlayerName = players[currentPlayer];
    const currentScore = Math.max(0, (playerScores[currentPlayerName] || 0) - 3);
    setPlayerScores({ ...playerScores, [currentPlayerName]: currentScore });

    if (user && currentPlayerName === user.username) {
      try {
        await apiRequest("POST", "/api/scores", {
          playerName: user.username,
          points: -3,
          userId: user.id,
          gameType: 'Truth or Dare'
        });

        toast({
          title: "Punktabzug",
          description: "-3 Punkte für das Überspringen der Aufgabe",
        });
      } catch (error) {
        console.error("Failed to save score:", error);
        toast({
          title: "Fehler",
          description: "Punktabzug konnte nicht gespeichert werden",
          variant: "destructive",
        });
      }
    }

    setChallenge(null);
    setCurrentPlayer((current) => (current + 1) % players.length);
  };

  if (truthLoading || dareLoading) {
    return <LoadingScreen message="Lade Fragen..." />;
  }

  if (isTransitioning) {
    return <LoadingScreen message="Wähle eine Aufgabe..." />;
  }

  if (!gameMode) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Wähle einen Spielmodus</h2>
            <div className="space-y-4">
              <Button
                onClick={() => selectGameMode('kids')}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Kinder-Modus 👶
              </Button>
              <Button
                onClick={() => selectGameMode('normal')}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Normal 😊
              </Button>
              <Button
                onClick={() => selectGameMode('spicy')}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Spicy 🌶️
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (playerCount === null) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Wie viele Spieler?</h2>
            <div className="space-y-4">
              {[2, 3, 4, 5, 6].map((count) => (
                <Button
                  key={count}
                  onClick={() => handlePlayerCountSubmit(count)}
                  className="w-full"
                >
                  {count} Spieler
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (players.length < playerCount) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">
              Spieler hinzufügen ({players.length}/{playerCount})
            </h2>
            <div className="space-y-4">
              {user && !players.includes(user.username) && (
                <Button
                  onClick={handleAddCurrentUser}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Als {user.username} spielen
                </Button>
              )}
              <div className="relative">
                <NicknameGenerator
                  onSelect={setNewPlayer}
                  currentNickname={newPlayer}
                />
              </div>
              <Button 
                onClick={() => addPlayer()}
                className="w-full"
                disabled={!newPlayer.trim()}
              >
                Hinzufügen
              </Button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Spielerliste:</h3>
              <ul className="space-y-2">
                {players.map((player, i) => (
                  <li key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
                    {player}
                    {user && player === user.username && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        (Angemeldet)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">
              {players[currentPlayer]} {t.truthOrDare.turn}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {t.truthOrDare.mode}: {gameMode === 'kids' ? t.truthOrDare.kids : gameMode === 'normal' ? t.truthOrDare.normal : t.truthOrDare.spicy}
            </p>
          </div>

          {challenge && (
            <div className="text-center mb-6">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-lg">{challenge}</p>
              <div className="mt-4 space-y-4">
                <Button
                  className="w-full"
                  onClick={handleCompleteChallenge}
                >
                  {t.truthOrDare.complete} (+5 {t.truthOrDare.points})
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleSkipChallenge}
                >
                  {t.truthOrDare.skip} (-3 {t.truthOrDare.points})
                </Button>
                <p className="text-sm font-semibold">
                  {t.truthOrDare.currentPoints}: {playerScores[players[currentPlayer]] || 0}
                </p>
              </div>
            </div>
          )}
          {!challenge && (
            <div className="flex gap-4">
              <Button
                className="flex-1"
                onClick={() => handleChallenge("truth")}
              >
                {t.truthOrDare.truth}
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleChallenge("dare")}
              >
                {t.truthOrDare.dare}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}