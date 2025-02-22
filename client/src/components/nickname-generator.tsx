import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

const adjectives = [
  "Crazy", "Wild", "Party", "Happy", "Lucky",
  "Dancing", "Jumping", "Glowing", "Funky", "Cool",
  "Super", "Mega", "Ultra", "Epic", "Awesome",
  "Mighty", "Royal", "Golden", "Magic", "Cosmic"
];

const nouns = [
  "Penguin", "Tiger", "Dragon", "Phoenix", "Unicorn",
  "Wizard", "Knight", "Ninja", "Panda", "Lion",
  "Champion", "Hero", "Legend", "Master", "Star",
  "Warrior", "Captain", "Beast", "Runner", "Gamer"
];

export interface NicknameGeneratorProps {
  onSelect: (nickname: string) => void;
  currentNickname?: string;
}

export function NicknameGenerator({ onSelect, currentNickname }: NicknameGeneratorProps) {
  const [nickname, setNickname] = useState(currentNickname || "");

  const generateNickname = () => {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const newNickname = `${randomAdjective}${randomNoun}`;
    setNickname(newNickname);
    onSelect(newNickname);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            onSelect(e.target.value);
          }}
          placeholder="Dein Nickname"
        />
        <Button
          onClick={generateNickname}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Generieren
        </Button>
      </div>
      {nickname && (
        <p className="text-sm text-muted-foreground text-center">
          Dein gewählter Nickname: <span className="font-semibold">{nickname}</span>
        </p>
      )}
    </div>
  );
}
