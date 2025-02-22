import { Game, Story, Score, InsertGame, InsertStory, InsertScore, GameState } from "@shared/schema";

export interface IStorage {
  createGame(game: InsertGame): Promise<Game>;
  getGame(id: number): Promise<Game | undefined>;
  updateGameState(id: number, state: GameState): Promise<Game>;
  createStory(story: InsertStory): Promise<Story>;
  getStory(id: number): Promise<Story | undefined>;
  getRecentStories(): Promise<Story[]>;
  createScore(score: InsertScore): Promise<Score>;
  getHighScores(): Promise<Score[]>;
}

export class MemStorage implements IStorage {
  private games: Map<number, Game>;
  private stories: Map<number, Story>;
  private scores: Map<number, Score>;
  private currentGameId: number;
  private currentStoryId: number;
  private currentScoreId: number;

  constructor() {
    this.games = new Map();
    this.stories = new Map();
    this.scores = new Map();
    this.currentGameId = 1;
    this.currentStoryId = 1;
    this.currentScoreId = 1;
  }

  async createGame(game: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const newGame: Game = {
      ...game,
      id,
      createdAt: new Date(),
    };
    this.games.set(id, newGame);
    return newGame;
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async updateGameState(id: number, state: GameState): Promise<Game> {
    const game = this.games.get(id);
    if (!game) throw new Error("Game not found");

    const updatedGame = {
      ...game,
      state,
    };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async createStory(story: InsertStory): Promise<Story> {
    const id = this.currentStoryId++;
    const newStory: Story = {
      ...story,
      id,
      createdAt: new Date(),
    };
    this.stories.set(id, newStory);
    return newStory;
  }

  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getRecentStories(): Promise<Story[]> {
    return Array.from(this.stories.values())
      .sort((a, b) => 
        (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
      )
      .slice(0, 10);
  }

  async createScore(score: InsertScore): Promise<Score> {
    const id = this.currentScoreId++;
    const newScore: Score = {
      ...score,
      id,
      createdAt: new Date(),
    };
    this.scores.set(id, newScore);
    return newScore;
  }

  async getHighScores(): Promise<Score[]> {
    return Array.from(this.scores.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  }
}

export const storage = new MemStorage();