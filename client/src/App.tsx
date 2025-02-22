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
import Admin from "@/pages/admin";
import AuthPage from "@/pages/auth";
import { useState } from "react";
import { LanguageContext, type Language } from "@/lib/i18n";
import { SplashScreen } from "@/components/splash-screen";
import HighScores from "@/pages/high-scores";
import { useAuth, AuthProvider } from "@/hooks/use-auth";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Component />;
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/dice" component={() => <ProtectedRoute component={DiceGame} />} />
          <Route path="/truth-or-dare" component={() => <ProtectedRoute component={TruthOrDare} />} />
          <Route path="/story" component={() => <ProtectedRoute component={StoryGenerator} />} />
          <Route path="/impressum" component={Impressum} />
          <Route path="/admin" component={() => <ProtectedRoute component={Admin} />} />
          <Route path="/high-scores" component={HighScores} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="py-4 border-t">
        <div className="container mx-auto px-4 text-center space-x-4">
          <Link href="/impressum" className="text-sm text-muted-foreground hover:text-primary">
            Impressum
          </Link>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">
            Admin
          </Link>
          <Link href="/high-scores" className="text-sm text-muted-foreground hover:text-primary">
            High Scores 🏆
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
      <AuthProvider>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <Router />
          <Toaster />
        </LanguageContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;