import { Dice1, MessageSquare, Feather } from "lucide-react";
import { GameCard } from "@/components/game-card";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const t = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        {t.home.title}
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GameCard
          title={t.home.diceGame.title}
          description={t.home.diceGame.description}
          path="/dice"
          icon={<Dice1 className="w-8 h-8 text-primary" />}
        />

        <GameCard
          title={t.home.truthOrDare.title}
          description={t.home.truthOrDare.description}
          path="/truth-or-dare"
          icon={<MessageSquare className="w-8 h-8 text-primary" />}
        />

        <GameCard
          title={t.home.storyGenerator.title}
          description={t.home.storyGenerator.description}
          icon={<Feather className="w-8 h-8 text-muted-foreground" />}
          className="opacity-70 cursor-not-allowed"
        />
      </div>
    </div>
  );
}