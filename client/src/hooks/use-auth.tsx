import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (data: { username: string; password: string; email: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/user");
        if (!response.ok) {
          return null;
        }
        return response.json();
      } catch (error) {
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/login", credentials);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login fehlgeschlagen");
      }
      return response.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Erfolgreich eingeloggt",
        description: `Willkommen zurück, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; password: string; email: string }) => {
      const response = await apiRequest("POST", "/api/register", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registrierung fehlgeschlagen");
      }
      return response.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registrierung erfolgreich",
        description: `Willkommen, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout");
      if (!response.ok) {
        throw new Error("Logout fehlgeschlagen");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Erfolgreich ausgeloggt",
        description: "Auf Wiedersehen!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error: error as Error | null,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
