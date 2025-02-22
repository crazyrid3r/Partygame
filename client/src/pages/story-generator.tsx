import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function StoryGenerator() {
  const [story, setStory] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!story.trim()) {
      toast({
        title: "Error",
        description: "Please write a story first",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await apiRequest("POST", "/api/stories", { content: story });
      toast({
        title: "Success",
        description: "Story saved successfully!",
      });
      setStory("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save story",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Collaborative Story</h2>

          <Textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Write your story here..."
            className="mb-4 min-h-[200px]"
          />

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? "Saving Story..." : "Save Story"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}