import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

const truths = [
  "Was ist dein peinlichster Moment?",
  "Was ist deine größte Angst?",
  "Was war dein schlimmstes Date?",
  // Weitere Fragen...
];

const dares = [
  "Mache deinen besten Tanzschritt",
  "Rufe jemanden an und singe für sie/ihn",
  "Mache ein lustiges Selfie",
  // Weitere Aufgaben...
];

export default function TruthOrDare() {
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [newPlayer, setNewPlayer] = useState("");
  const [challenge, setChallenge] = useState<string | null>(null);

  const handlePlayerCountSubmit = (count: number) => {
    if (count > 0) {
      setPlayerCount(count);
    }
  };

  const addPlayer = () => {
    if (newPlayer.trim() && players.length < playerCount!) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer("");
    }
  };

  const getChallenge = (type: "truth" | "dare") => {
    const list = type === "truth" ? truths : dares;
    setChallenge(list[Math.floor(Math.random() * list.length)]);
    setCurrentPlayer((current) => (current + 1) % players.length);
  };

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
            <div className="flex gap-2 mb-4">
              <Input
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                placeholder="Spielername"
                onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              />
              <Button onClick={addPlayer}>Hinzufügen</Button>
            </div>
            <ul className="space-y-2">
              {players.map((player, i) => (
                <li key={i} className="flex items-center gap-2">
                  {player}
                </li>
              ))}
            </ul>
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
              {players[currentPlayer]} ist dran
            </h2>
          </div>

          {challenge ? (
            <div className="text-center mb-6">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-lg">{challenge}</p>
              <Button
                className="mt-4"
                onClick={() => setChallenge(null)}
              >
                Nächster Spieler
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button
                className="flex-1"
                onClick={() => getChallenge("truth")}
              >
                Wahrheit
              </Button>
              <Button
                className="flex-1"
                onClick={() => getChallenge("dare")}
              >
                Pflicht
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}