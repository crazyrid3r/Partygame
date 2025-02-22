import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Medal } from "lucide-react";
import type { Score } from "@shared/schema";

export default function HighScores() {
  const { data: scores } = useQuery<Score[]>({
    queryKey: ["/api/scores"]
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold mb-6 text-center">High Scores 🏆</h1>
          
          <div className="space-y-4">
            {scores?.map((score, index) => (
              <div
                key={score.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {index < 3 && (
                    <Medal className={`w-6 h-6 ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      'text-amber-600'
                    }`} />
                  )}
                  <span className="font-semibold">{score.playerName}</span>
                </div>
                <span className="text-xl font-bold">{score.points} Punkte</span>
              </div>
            ))}

            {!scores?.length && (
              <p className="text-center text-muted-foreground">
                Noch keine Highscores vorhanden. Spiele eine Runde um auf die Liste zu kommen!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
