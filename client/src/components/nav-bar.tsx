import { Home } from "lucide-react";
import { Link, useLocation } from "wouter";

export function NavBar() {
  const [location] = useLocation();
  
  return (
    <nav className="bg-primary/5 border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 font-semibold text-lg hover:text-primary transition-colors">
            <Home className="w-5 h-5" />
            Hauptmenü
          </a>
        </Link>
        
        {location !== "/" && (
          <span className="text-muted-foreground">
            {location === "/dice" && "Würfelspiel"}
            {location === "/truth-or-dare" && "Wahrheit oder Pflicht"}
            {location === "/story" && "Story Generator"}
          </span>
        )}
      </div>
    </nav>
  );
}
