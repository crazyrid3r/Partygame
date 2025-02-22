import { Dice1, MessageSquare, Feather } from "lucide-react";
import { GameCard } from "@/components/game-card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Drinking Games
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GameCard
          title="Dice Game"
          description="Roll the dice and follow the rules"
          path="/dice"
          icon={<Dice1 className="w-8 h-8 text-primary" />}
        />

        <GameCard
          title="Truth or Dare"
          description="Choose wisely between truth and dare"
          path="/truth-or-dare"
          icon={<MessageSquare className="w-8 h-8 text-primary" />}
        />

        <GameCard
          title="Story Generator"
          description="Create a story together and get an AI image"
          path="/story"
          icon={<Feather className="w-8 h-8 text-primary" />}
        />
      </div>
    </div>
  );
}