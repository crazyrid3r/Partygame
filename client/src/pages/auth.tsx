import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, register, user } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await login({
          username: formData.username,
          password: formData.password,
        });
      } else {
        await register(formData);
      }
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Ein Fehler ist aufgetreten",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container grid lg:grid-cols-2 gap-8 items-center max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "login" ? "Einloggen" : "Registrieren"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Logge dich ein, um deine Punkte zu speichern und mit Freunden zu spielen."
                : "Erstelle einen Account, um deine Punkte zu speichern und mit Freunden zu spielen."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Benutzername"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              {mode === "register" && (
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="E-Mail"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Passwort"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                {mode === "login" ? "Einloggen" : "Registrieren"}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {mode === "login"
                    ? "Noch keinen Account? Registriere dich hier"
                    : "Bereits registriert? Hier einloggen"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="hidden lg:block space-y-4">
          <h1 className="text-4xl font-bold">Willkommen bei Drinking Games!</h1>
          <p className="text-lg text-muted-foreground">
            Spiele verschiedene Trinkspiele, sammle Punkte und fordere deine Freunde heraus.
            Mit einem Account kannst du:
          </p>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>Deine Highscores speichern</li>
            <li>Ein Profilbild hochladen</li>
            <li>Mit anderen Spielern chatten</li>
            <li>Freunde hinzufügen</li>
            <li>Und vieles mehr!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}