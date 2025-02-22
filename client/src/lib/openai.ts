import { apiRequest } from "./queryClient";

export async function generateStoryImage(story: string) {
  const response = await apiRequest("POST", "/api/stories", {
    content: story
  });
  return response.json();
}
