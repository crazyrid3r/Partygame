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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  if (!user) {
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = user.profileImage;

      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        const response = await fetch('/api/upload-profile-image', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Bildupload fehlgeschlagen');
        const data = await response.json();
        imageUrl = data.imageUrl;
      }

      await updateProfile({
        username: formData.username !== user.username ? formData.username : undefined,
        email: formData.email !== user.email ? formData.email : undefined,
        bio: formData.bio !== user.bio ? formData.bio : undefined,
        profileImage: imageUrl !== user.profileImage ? imageUrl : undefined,
      });
      setIsEditing(false);
      setSelectedImage(null);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Ein Fehler ist aufgetreten",
        variant: "destructive",
      });
    }
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
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <label 
                    htmlFor="profile-image" 
                    className="cursor-pointer bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90"
                  >
                    <Upload className="w-4 h-4" />
                  </label>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
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
                className="min-h-[100px]"
              />
            </div>
            <div className="pt-4 space-x-4">
              {isEditing ? (
                <>
                  <Button type="submit">Speichern</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: user.username,
                        email: user.email,
                        bio: user.bio || "",
                      });
                      setSelectedImage(null);
                    }}
                  >
                    Abbrechen
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
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