import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NavBar } from "@/components/nav-bar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DiceGame from "@/pages/dice-game";
import TruthOrDare from "@/pages/truth-or-dare";
import StoryGenerator from "@/pages/story-generator";
import Impressum from "@/pages/impressum";
import { useState } from "react";
import { LanguageContext, type Language, useTranslation } from "@/lib/i18n";
import { SplashScreen } from "@/components/splash-screen";

function Router() {
  const t = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dice" component={DiceGame} />
          <Route path="/truth-or-dare" component={TruthOrDare} />
          <Route path="/story" component={StoryGenerator} />
          <Route path="/impressum" component={Impressum} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="py-4 border-t">
        <div className="container mx-auto px-4 text-center">
          <Link href="/impressum" className="text-sm text-muted-foreground hover:text-primary">
            {t.nav.impressum}
          </Link>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>('de');
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <Router />
        <Toaster />
      </LanguageContext.Provider>
    </QueryClientProvider>
  );
}

export default App;