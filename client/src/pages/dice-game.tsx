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

export default function DiceGame() {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const rollDice = () => {
    setRolling(true);
    setTimeout(() => {
      setResult(Math.floor(Math.random() * 6) + 1);
      setRolling(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Dice Game</h1>

      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            <Dice1
              className={`w-24 h-24 text-primary ${
                rolling ? "animate-spin" : ""
              }`}
            />

            {result && (
              <div className="text-center">
                <p className="text-2xl font-bold mb-2">{result}</p>
                <p className="text-lg">{rules[result - 1]}</p>
              </div>
            )}

            <Button
              size="lg"
              onClick={rollDice}
              disabled={rolling}
              className="w-full"
            >
              {rolling ? "Rolling..." : "Roll Dice"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}