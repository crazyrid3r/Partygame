import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, insertStorySchema, insertScoreSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game routes
  app.post("/api/games", async (req, res) => {
    const parsed = insertGameSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid game data" });
    }
    const game = await storage.createGame(parsed.data);
    res.json(game);
  });

  app.get("/api/games/:id", async (req, res) => {
    const game = await storage.getGame(parseInt(req.params.id));
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  });

  app.patch("/api/games/:id/state", async (req, res) => {
    const game = await storage.updateGameState(parseInt(req.params.id), req.body);
    res.json(game);
  });

  // Story routes
  app.post("/api/stories", async (req, res) => {
    const parsed = insertStorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid story data" });
    }

    const story = await storage.createStory(parsed.data);
    res.json(story);
  });

  app.get("/api/stories/recent", async (_req, res) => {
    const stories = await storage.getRecentStories();
    res.json(stories);
  });

  // Score routes
  app.post("/api/scores", async (req, res) => {
    const parsed = insertScoreSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid score data" });
    }
    const score = await storage.createScore(parsed.data);
    res.json(score);
  });

  app.get("/api/scores", async (_req, res) => {
    const scores = await storage.getHighScores();
    res.json(scores);
  });

  const httpServer = createServer(app);
  return httpServer;
}