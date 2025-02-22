import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { insertGameSchema, insertStorySchema, insertScoreSchema, insertQuestionSchema, insertUserSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import express from 'express';
import XLSX from 'xlsx';

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
      // Debug-Log für eingehende Daten
      console.log("Incoming update data:", req.body);

      // Erlauben wir explizit bio und profileImage
      const updateData = {
        ...req.body,
        id: undefined,
        password: undefined,
        createdAt: undefined
      };

      console.log("Processed update data:", updateData);

      // Führe das Update durch
      const updatedUser = await storage.updateUser(req.user.id, updateData);

      // Debug-Log für den aktualisierten Benutzer
      console.log("Updated user result:", updatedUser);

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

    // Ensure userId is properly set for authenticated users
    if (req.isAuthenticated()) {
      parsed.data.userId = req.user.id;
    }

    try {
      const score = await storage.createScore(parsed.data);
      res.json(score);
    } catch (error) {
      console.error("Failed to create score:", error);
      res.status(500).json({ error: "Failed to create score" });
    }
  });

  app.get("/api/scores", async (_req, res) => {
    try {
      const scores = await storage.getHighScores();
      res.json(scores);
    } catch (error) {
      console.error("Failed to get high scores:", error);
      res.status(500).json({ error: "Failed to get high scores" });
    }
  });

  // Neue Route für Benutzer-Gesamtpunktzahl
  app.get("/api/user/total-points", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const totalPoints = await storage.getUserTotalPoints(req.user.id);
      res.json({ totalPoints });
    } catch (error) {
      console.error("Get total points error:", error);
      res.status(500).json({ error: "Failed to get total points" });
    }
  });

  // Export questions route
  app.get("/api/questions/export", async (_req, res) => {
    try {
      // Get all active questions
      const allQuestions = await storage.getAllQuestions();

      // Create a worksheet with translations
      const worksheet = XLSX.utils.json_to_sheet(allQuestions.map(q => ({
        type: q.type,
        content_de: q.content, // German content (original)
        content_en: q.content_en || '', // English content
        mode: q.mode,
        active: q.active ? 'true' : 'false'
      })));

      // Add column headers with descriptions
      XLSX.utils.sheet_add_aoa(worksheet, [
        ['Type', 'German Content', 'English Content', 'Mode', 'Active']
      ], { origin: 'A1' });

      // Create workbook and add worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");

      // Write Excel file to buffer
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Send file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=questions.xlsx');
      res.send(excelBuffer);
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ error: "Failed to export questions" });
    }
  });

  // Import questions route
  app.post("/api/questions/import", upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    try {
      // Read Excel file
      const workbook = XLSX.read(req.file.buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const questions = XLSX.utils.sheet_to_json(worksheet);

      // Validate and import questions
      const results = await Promise.all(
        questions.map(async (q: any) => {
          const question = {
            type: q.type,
            content: q.content_de || q.content, // German content
            content_en: q.content_en, // English content
            mode: q.mode,
            active: q.active === 'true'
          };

          try {
            const parsed = insertQuestionSchema.safeParse(question);
            if (parsed.success) {
              return await storage.createQuestion(parsed.data);
            }
            return { error: "Invalid question format", question };
          } catch (error) {
            return { error: "Failed to import question", question };
          }
        })
      );

      res.json({
        success: results.filter(r => !('error' in r)).length,
        failed: results.filter(r => 'error' in r).length,
        errors: results.filter(r => 'error' in r)
      });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ error: "Failed to import questions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}