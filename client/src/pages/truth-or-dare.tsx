import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

const truths = [
  "What's your most embarrassing moment?",
  "What's your biggest fear?",
  "What's the worst date you've been on?",
  // Add more truths
];

const dares = [
  "Do your best dance move",
  "Call someone and sing to them",
  "Take a funny selfie",
  // Add more dares
];

export default function TruthOrDare() {
  const [players, setPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [newPlayer, setNewPlayer] = useState("");
  const [challenge, setChallenge] = useState<string | null>(null);

  const addPlayer = () => {
    if (newPlayer.trim()) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer("");
    }
  };

  const getChallenge = (type: "truth" | "dare") => {
    const list = type === "truth" ? truths : dares;
    setChallenge(list[Math.floor(Math.random() * list.length)]);
    setCurrentPlayer((current) => (current + 1) % players.length);
  };

  if (players.length < 2) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Add Players</h2>
            <div className="flex gap-2 mb-4">
              <Input
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                placeholder="Player name"
                onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              />
              <Button onClick={addPlayer}>Add</Button>
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
              {players[currentPlayer]}'s Turn
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
                Next Player
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button
                className="flex-1"
                onClick={() => getChallenge("truth")}
              >
                Truth
              </Button>
              <Button
                className="flex-1"
                onClick={() => getChallenge("dare")}
              >
                Dare
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
