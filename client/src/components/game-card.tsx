import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";

interface GameCardProps {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

export function GameCard({ title, description, path, icon }: GameCardProps) {
  return (
    <Link href={path}>
      <Card className="cursor-pointer hover:bg-accent transition-colors">
        <CardHeader>
          <div className="flex items-center gap-4">
            {icon}
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
