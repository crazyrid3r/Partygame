import { Game, Story, Score, Question, User, InsertGame, InsertStory, InsertScore, InsertQuestion, InsertUser, GameState } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { games, stories, scores, questions, users } from "@shared/schema";
import { sql } from 'drizzle-orm';

export interface IStorage {
  // User management
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUser(id: number, updateData: Partial<User>): Promise<User>;

  // Existing methods
  createGame(game: InsertGame): Promise<Game>;
  getGame(id: number): Promise<Game | undefined>;
  updateGameState(id: number, state: GameState): Promise<Game>;
  createStory(story: InsertStory): Promise<Story>;
  getStory(id: number): Promise<Story | undefined>;
  getRecentStories(): Promise<Story[]>;
  createScore(score: InsertScore): Promise<Score>;
  getHighScores(): Promise<Score[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestions(type: 'truth' | 'dare', mode: 'kids' | 'normal' | 'spicy'): Promise<Question[]>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question>;
  deleteQuestion(id: number): Promise<void>;
  getUserTotalPoints(userId: number): Promise<number>;
  getAllQuestions(): Promise<Question[]>;
}

export class DatabaseStorage implements IStorage {
  // User management methods remain unchanged
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(cleanedData).length === 0) {
      throw new Error("No values to set");
    }

    const [updatedUser] = await db
      .update(users)
      .set(cleanedData)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  // Game methods remain unchanged
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

  // Story methods with fixed ordering
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
      .orderBy(stories.createdAt.desc())
      .limit(10);
  }

  // Score methods with fixed SQL type handling
  async createScore(score: InsertScore): Promise<Score> {
    const [newScore] = await db.insert(scores).values(score).returning();
    return newScore;
  }

  async getHighScores(): Promise<Score[]> {
    try {
      const result = await db
        .select({
          playerName: scores.playerName,
          points: sql<number>`CAST(SUM(${scores.points}) as INTEGER)`.mapWith(Number),
        })
        .from(scores)
        .groupBy(scores.playerName)
        .orderBy(desc(sql`SUM(${scores.points})`))
        .limit(10);

      if (!result || result.length === 0) {
        return [];
      }

      return result.map((score, index) => ({
        id: index + 1,
        userId: null,
        playerName: score.playerName,
        points: score.points,
        gameType: 'Gesamt',
        createdAt: new Date()
      }));
    } catch (error) {
      console.error("Error fetching high scores:", error);
      throw new Error("Failed to fetch high scores");
    }
  }

  // Question methods with translation support
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

  async getUserTotalPoints(userId: number): Promise<number> {
    const userScores = await db
      .select({ points: scores.points })
      .from(scores)
      .where(eq(scores.userId, userId));

    return userScores.reduce((total, score) => total + score.points, 0);
  }

  async getAllQuestions(): Promise<Question[]> {
    return db
      .select()
      .from(questions)
      .where(eq(questions.active, true));
  }
}

export const storage = new DatabaseStorage();