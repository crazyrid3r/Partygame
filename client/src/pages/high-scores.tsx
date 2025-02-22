import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Medal } from "lucide-react";
import type { Score } from "@shared/schema";
import { LoadingScreen } from "@/components/loading-screen";
import { Button } from "@/components/ui/button";

export default function HighScores() {
  const { data: scores, isLoading, error, refetch } = useQuery<Score[]>({
    queryKey: ["/api/scores"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return <LoadingScreen message="Lade Bestenliste..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 mb-4">
              Fehler beim Laden der Bestenliste. Bitte versuche es später erneut.
            </p>
            <Button onClick={() => refetch()}>Erneut versuchen</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  <div>
                    <span className="font-semibold">{score.playerName}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({score.gameType || 'Unbekannt'})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{score.points}</span>
                  <span className="text-sm text-muted-foreground">Punkte</span>
                </div>
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