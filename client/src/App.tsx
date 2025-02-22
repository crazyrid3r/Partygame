import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NavBar } from "@/components/nav-bar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DiceGame from "@/pages/dice-game";
import TruthOrDare from "@/pages/truth-or-dare";
import StoryGenerator from "@/pages/story-generator";
import { useState } from "react";
import { LanguageContext, type Language } from "@/lib/i18n";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dice" component={DiceGame} />
          <Route path="/truth-or-dare" component={TruthOrDare} />
          <Route path="/story" component={StoryGenerator} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>('de');

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