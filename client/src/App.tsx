import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DiceGame from "@/pages/dice-game";
import TruthOrDare from "@/pages/truth-or-dare";
import StoryGenerator from "@/pages/story-generator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dice" component={DiceGame} />
      <Route path="/truth-or-dare" component={TruthOrDare} />
      <Route path="/story" component={StoryGenerator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
