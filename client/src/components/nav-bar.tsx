import { Home, Languages } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { LanguageContext, useTranslation } from "@/lib/i18n";

export function NavBar() {
  const [location] = useLocation();
  const t = useTranslation();
  const { setLanguage } = useContext(LanguageContext);

  return (
    <nav className="bg-primary/5 border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 font-semibold text-lg">
            <Home className="w-5 h-5" />
            {t.nav.home}
          </Button>
        </Link>

        <div className="flex items-center gap-4">
          {location !== "/" && (
            <span className="text-muted-foreground">
              {location === "/dice" && t.nav.diceGame}
              {location === "/truth-or-dare" && t.nav.truthOrDare}
              {location === "/story" && t.nav.storyGenerator}
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('de')}>
                🇩🇪 Deutsch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}