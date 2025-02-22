import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Upload } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  if (!user) {
    return null;
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Fehler",
          description: "Das Bild darf nicht größer als 5MB sein",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/upload-profile-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Bildupload fehlgeschlagen');

        const data = await response.json();
        await updateProfile({
          profileImage: data.imageUrl
        });

        toast({
          title: "Erfolg",
          description: "Profilbild wurde aktualisiert",
        });
      } catch (error: any) {
        toast({
          title: "Fehler",
          description: error.message || "Bildupload fehlgeschlagen",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updates: Record<string, string> = {};

      if (formData.username !== user.username) {
        updates.username = formData.username;
      }
      if (formData.email !== user.email) {
        updates.email = formData.email;
      }
      if (formData.bio !== user.bio) {
        updates.bio = formData.bio;
      }

      if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
        setIsEditing(false);
        toast({
          title: "Erfolg",
          description: "Profil wurde aktualisiert",
        });
      } else {
        setIsEditing(false);
      }
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Ein Fehler ist aufgetreten",
        variant: "destructive",
      });
    }
  };

  const startEditing = () => {
    setFormData({
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData({
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profilbild"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2">
                <label
                  htmlFor="profile-image"
                  className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 shadow-lg flex items-center justify-center"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div>
              <CardTitle>Benutzerprofil</CardTitle>
              <CardDescription>
                Verwalte deine persönlichen Informationen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Benutzername</label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={!isEditing}
                placeholder="Dein Benutzername"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-Mail</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
                placeholder="deine@email.de"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Über mich</label>
              <Textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                disabled={!isEditing}
                placeholder="Erzähle etwas über dich..."
                className="min-h-[100px] resize-none"
              />
            </div>
            <div className="pt-4 space-x-4">
              {isEditing ? (
                <>
                  <Button type="submit">Speichern</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEditing}
                  >
                    Abbrechen
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={startEditing}
                >
                  Bearbeiten
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}