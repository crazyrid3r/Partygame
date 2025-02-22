import { Home, Languages, LogIn, LogOut, User } from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth";

export function NavBar() {
  const [location] = useLocation();
  const t = useTranslation();
  const { setLanguage } = useContext(LanguageContext);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

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

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {user.username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button variant="ghost" className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Login
              </Button>
            </Link>
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