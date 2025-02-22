import { Game, Story, Score, Question, InsertGame, InsertStory, InsertScore, InsertQuestion, GameState } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { games, stories, scores, questions } from "@shared/schema";

export interface IStorage {
  createGame(game: InsertGame): Promise<Game>;
  getGame(id: number): Promise<Game | undefined>;
  updateGameState(id: number, state: GameState): Promise<Game>;
  createStory(story: InsertStory): Promise<Story>;
  getStory(id: number): Promise<Story | undefined>;
  getRecentStories(): Promise<Story[]>;
  createScore(score: InsertScore): Promise<Score>;
  getHighScores(): Promise<Score[]>;
  // Neue Methoden für Fragen
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestions(type: 'truth' | 'dare', mode: 'kids' | 'normal' | 'spicy'): Promise<Question[]>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question>;
  deleteQuestion(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db.insert(games).values(game).returning();
    return newGame;
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async updateGameState(id: number, state: GameState): Promise<Game> {
    const [game] = await db
      .update(games)
      .set({ state })
      .where(eq(games.id, id))
      .returning();
    return game;
  }

  async createStory(story: InsertStory): Promise<Story> {
    const [newStory] = await db.insert(stories).values(story).returning();
    return newStory;
  }

  async getStory(id: number): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story;
  }

  async getRecentStories(): Promise<Story[]> {
    return db
      .select()
      .from(stories)
      .orderBy({ created_at: 'desc' })
      .limit(10);
  }

  async createScore(score: InsertScore): Promise<Score> {
    const [newScore] = await db.insert(scores).values(score).returning();
    return newScore;
  }

  async getHighScores(): Promise<Score[]> {
    return db
      .select()
      .from(scores)
      .orderBy({ points: 'desc' })
      .limit(10);
  }

  // Neue Methoden für Fragen
  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db.insert(questions).values(question).returning();
    return newQuestion;
  }

  async getQuestions(type: 'truth' | 'dare', mode: 'kids' | 'normal' | 'spicy'): Promise<Question[]> {
    return db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.type, type),
          eq(questions.mode, mode),
          eq(questions.active, true)
        )
      );
  }

  async updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question> {
    const [updatedQuestion] = await db
      .update(questions)
      .set(question)
      .where(eq(questions.id, id))
      .returning();
    return updatedQuestion;
  }

  async deleteQuestion(id: number): Promise<void> {
    await db
      .update(questions)
      .set({ active: false })
      .where(eq(questions.id, id));
  }
}

export const storage = new DatabaseStorage();