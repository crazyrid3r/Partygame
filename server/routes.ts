import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { insertGameSchema, insertStorySchema, insertScoreSchema, insertQuestionSchema, insertUserSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import express from 'express';


// Konfiguriere multer für Bilduploads
const multerStorage = multer.diskStorage({
  destination: './uploads/profile-images',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB Limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Nur Bilder im Format JPEG, PNG oder GIF sind erlaubt'));
      return;
    }
    cb(null, true);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes and middleware
  setupAuth(app);

  // Erstelle den Upload-Ordner, falls er nicht existiert
  app.use(express.static('uploads'));
  app.use('/uploads', express.static('uploads'));


  // User routes
  app.post("/api/upload-profile-image", upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const imageUrl = `/uploads/profile-images/${req.file.filename}`;
    res.json({ imageUrl });
  });

  app.patch("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      // Wenn wir im Bearbeitungsmodus sind, erlauben wir das Aktualisieren
      // auch wenn keine Änderungen vorgenommen wurden
      const updatedUser = await storage.getUser(req.user.id);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Wenn es Aktualisierungen gibt, führen wir sie durch
      if (Object.keys(req.body).length > 0) {
        const parsed = insertUserSchema.partial().safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({ error: "Invalid user data" });
        }

        const updateData = Object.entries(parsed.data).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>);

        // Aktualisiere den Benutzer nur wenn es tatsächlich Änderungen gibt
        if (Object.keys(updateData).length > 0) {
          const updatedUser = await storage.updateUser(req.user.id, updateData);
          return res.json(updatedUser);
        }
      }

      // Wenn keine Änderungen vorliegen, senden wir einfach die aktuellen Benutzerdaten zurück
      res.json(updatedUser);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

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

  // Question routes
  app.post("/api/questions", async (req, res) => {
    const parsed = insertQuestionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid question data" });
    }
    const question = await storage.createQuestion(parsed.data);
    res.json(question);
  });

  app.get("/api/questions/:type/:mode", async (req, res) => {
    const { type, mode } = req.params;
    if (!['truth', 'dare'].includes(type) || !['kids', 'normal', 'spicy'].includes(mode)) {
      return res.status(400).json({ error: "Invalid type or mode" });
    }
    const questions = await storage.getQuestions(type as 'truth' | 'dare', mode as 'kids' | 'normal' | 'spicy');
    res.json(questions);
  });

  app.patch("/api/questions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = insertQuestionSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid question data" });
    }
    const question = await storage.updateQuestion(id, parsed.data);
    res.json(question);
  });

  app.delete("/api/questions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteQuestion(id);
    res.status(204).send();
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