import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dice1 } from "lucide-react";

const rules = [
  "Everyone drinks",
  "Player drinks",
  "Give 2 drinks",
  "Categories",
  "Never have I ever",
  "Rule maker",
];

interface DiceResult {
  value: number;
  rule: string;
}

export default function DiceGame() {
  const [rolling, setRolling] = useState(false);
  const [results, setResults] = useState<[DiceResult | null, DiceResult | null]>([null, null]);

  const rollDice = () => {
    setRolling(true);
    setTimeout(() => {
      const dice1 = {
        value: Math.floor(Math.random() * 6) + 1,
        rule: rules[Math.floor(Math.random() * rules.length)]
      };
      const dice2 = {
        value: Math.floor(Math.random() * 6) + 1,
        rule: rules[Math.floor(Math.random() * rules.length)]
      };
      setResults([dice1, dice2]);
      setRolling(false);
    }, 1000);
  };

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
                  <p className="text-lg">{results[0].rule}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-2">Würfel 2: {results[1].value}</p>
                  <p className="text-lg">{results[1].rule}</p>
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