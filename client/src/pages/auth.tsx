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

type AuthMode = "login" | "register" | "forgot-password";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, register, resetPassword, user } = useAuth();
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
        setLocation("/");
      } else if (mode === "register") {
        await register(formData);
        setLocation("/");
      } else if (mode === "forgot-password") {
        await resetPassword(formData.email);
        toast({
          title: "Passwort zurücksetzen",
          description: "Wenn ein Account mit dieser E-Mail existiert, werden Sie Anweisungen zum Zurücksetzen Ihres Passworts erhalten.",
        });
        setMode("login");
      }
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Ein Fehler ist aufgetreten",
        variant: "destructive",
      });
    }
  };

  const renderForm = () => {
    if (mode === "forgot-password") {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full">
            Passwort zurücksetzen
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Zurück zum Login
            </button>
          </div>
        </form>
      );
    }

    return (
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
        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
            className="text-sm text-muted-foreground hover:text-primary block w-full"
          >
            {mode === "login"
              ? "Noch keinen Account? Registriere dich hier"
              : "Bereits registriert? Hier einloggen"}
          </button>
          {mode === "login" && (
            <button
              type="button"
              onClick={() => setMode("forgot-password")}
              className="text-sm text-muted-foreground hover:text-primary block w-full"
            >
              Passwort vergessen?
            </button>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container grid lg:grid-cols-2 gap-8 items-center max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "login" 
                ? "Einloggen" 
                : mode === "register" 
                ? "Registrieren"
                : "Passwort vergessen"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Logge dich ein, um deine Punkte zu speichern und mit Freunden zu spielen."
                : mode === "register"
                ? "Erstelle einen Account, um deine Punkte zu speichern und mit Freunden zu spielen."
                : "Gib deine E-Mail-Adresse ein, um dein Passwort zurückzusetzen."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderForm()}
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