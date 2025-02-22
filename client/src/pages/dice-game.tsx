import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dice1 } from "lucide-react";

interface DiceResult {
  value: number;
}

export default function DiceGame() {
  const [rolling, setRolling] = useState(false);
  const [results, setResults] = useState<[DiceResult | null, DiceResult | null]>([null, null]);

  const rollDice = () => {
    setRolling(true);
    setTimeout(() => {
      const dice1 = {
        value: Math.floor(Math.random() * 6) + 1,
      };
      const dice2 = {
        value: Math.floor(Math.random() * 6) + 1,
      };
      setResults([dice1, dice2]);
      setRolling(false);
    }, 1000);
  };

  const total = results[0] && results[1] ? results[0].value + results[1].value : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Würfelspiel</h1>

      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-8">
              <Dice1
                className={`w-24 h-24 text-primary ${
                  rolling ? "animate-spin" : ""
                }`}
              />
              <Dice1
                className={`w-24 h-24 text-primary ${
                  rolling ? "animate-spin" : ""
                }`}
              />
            </div>

            {results[0] && results[1] && (
              <div className="text-center space-y-4">
                <div>
                  <p className="text-2xl font-bold mb-2">Würfel 1: {results[0].value}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-2">Würfel 2: {results[1].value}</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-3xl font-bold">Summe: {total}</p>
                </div>
              </div>
            )}

            <Button
              size="lg"
              onClick={rollDice}
              disabled={rolling}
              className="w-full"
            >
              {rolling ? "Würfeln..." : "Würfeln"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}