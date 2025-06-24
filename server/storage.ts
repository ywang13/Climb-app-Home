import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { desc, eq, sql, and } from "drizzle-orm";
import type { SelectUser, SelectSession, InsertSession, FeedSession } from "../shared/schema";
import { users, sessions } from "../shared/schema";

export interface Database {
  // User operations
  getUser(id: number): Promise<SelectUser | undefined>;
  getUserByEmail(email: string): Promise<SelectUser | undefined>;
  createUser(username: string, email: string, hashedPassword: string, avatarUrl?: string): Promise<SelectUser>;
  
  // Session operations
  getFeed(page: number, limit: number): Promise<{ sessions: FeedSession[]; total: number }>;
  getSession(sessionId: number): Promise<(SelectSession & { user: SelectUser }) | undefined>;
  createSession(userId: number, location: string, title: string, totalSends: number, routesClimbed: number, durationMinutes: number): Promise<SelectSession>;
  updateSession(sessionId: number, userId: number, updates: Partial<InsertSession>): Promise<SelectSession | undefined>;
  deleteSession(sessionId: number, userId: number): Promise<boolean>;
}

class DrizzleDatabase implements Database {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql, { schema: { users, sessions } });
  }

  async getUser(id: number): Promise<SelectUser | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<SelectUser | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(username: string, email: string, hashedPassword: string, avatarUrl?: string): Promise<SelectUser> {
    const result = await this.db.insert(users).values({
      username,
      email,
      hashedPassword,
      avatarUrl,
    }).returning();
    return result[0];
  }

  async getFeed(page: number, limit: number): Promise<{ sessions: FeedSession[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const result = await this.db
      .select({
        id: sessions.id,
        title: sessions.title,
        location: sessions.location,
        totalSends: sessions.totalSends,
        routesClimbed: sessions.routesClimbed,
        durationMinutes: sessions.durationMinutes,
        createdAt: sessions.createdAt,
        user: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(sessions)
      .leftJoin(users, eq(sessions.userId, users.id))
      .orderBy(desc(sessions.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(sessions);
    
    const total = totalResult[0].count;

    const feedSessions: FeedSession[] = result.map((row) => ({
      id: row.id,
      user: row.user!,
      location: row.location,
      createdAt: row.createdAt!,
      title: row.title,
      stats: {
        totalSends: row.totalSends || 0,
        routesClimbed: row.routesClimbed || 0,
        duration: this.formatDuration(row.durationMinutes),
      },
    }));

    return { sessions: feedSessions, total };
  }

  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    }
    return `${hours}h ${mins}m`;
  }

  async getSession(sessionId: number): Promise<(SelectSession & { user: SelectUser }) | undefined> {
    const result = await this.db
      .select({
        id: sessions.id,
        userId: sessions.userId,
        location: sessions.location,
        title: sessions.title,
        totalSends: sessions.totalSends,
        routesClimbed: sessions.routesClimbed,
        durationMinutes: sessions.durationMinutes,
        createdAt: sessions.createdAt,
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
          hashedPassword: users.hashedPassword,
          avatarUrl: users.avatarUrl,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(sessions)
      .leftJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId));

    if (result.length === 0) return undefined;
    
    const row = result[0];
    return {
      id: row.id,
      userId: row.userId,
      location: row.location,
      title: row.title,
      totalSends: row.totalSends,
      routesClimbed: row.routesClimbed,
      durationMinutes: row.durationMinutes,
      createdAt: row.createdAt,
      user: row.user!,
    };
  }

  async createSession(userId: number, location: string, title: string, totalSends: number, routesClimbed: number, durationMinutes: number): Promise<SelectSession> {
    const result = await this.db.insert(sessions).values({
      userId,
      location,
      title,
      totalSends,
      routesClimbed,
      durationMinutes,
    }).returning();
    return result[0];
  }

  async updateSession(sessionId: number, userId: number, updates: Partial<InsertSession>): Promise<SelectSession | undefined> {
    const result = await this.db
      .update(sessions)
      .set(updates)
      .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)))
      .returning();
    
    return result[0];
  }

  async deleteSession(sessionId: number, userId: number): Promise<boolean> {
    const result = await this.db
      .delete(sessions)
      .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)))
      .returning();
    
    return result.length > 0;
  }
}

class InMemoryDatabase implements Database {
  private users: SelectUser[] = [];
  private sessions: (SelectSession & { user: SelectUser })[] = [];
  private nextUserId = 1;
  private nextSessionId = 1;

  constructor() {
    // Add sample users with new schema
    this.users = [
      {
        id: 1,
        username: "alex_climber",
        email: "alex@example.com",
        hashedPassword: "$2b$12$sample.hashed.password.here",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: "sarah_sends",
        email: "sarah@example.com",
        hashedPassword: "$2b$12$sample.hashed.password.here",
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100&h=100&fit=crop&crop=face",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        username: "mike_boulder",
        email: "mike@example.com",
        hashedPassword: "$2b$12$sample.hashed.password.here",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.nextUserId = 4;

    // Add sample sessions with new schema
    const now = new Date();
    const today = new Date(now);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    this.sessions = [
      {
        id: 1,
        userId: 1,
        location: "Movement Santa Clara",
        title: "Great bouldering session!",
        totalSends: 8,
        routesClimbed: 12,
        durationMinutes: 116, // 1h 56m
        createdAt: today,
        user: this.users[0],
      },
      {
        id: 2,
        userId: 2,
        location: "Movement Sunnyvale",
        title: "Top rope training",
        totalSends: 6,
        routesClimbed: 8,
        durationMinutes: 90, // 1h 30m
        createdAt: yesterday,
        user: this.users[1],
      },
      {
        id: 3,
        userId: 3,
        location: "Movement Berkeley",
        title: "Quick lunch session",
        totalSends: 4,
        routesClimbed: 6,
        durationMinutes: 45, // 45m
        createdAt: twoDaysAgo,
        user: this.users[2],
      },
    ];
    this.nextSessionId = 4;
  }

  async getUser(id: number): Promise<SelectUser | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByEmail(email: string): Promise<SelectUser | undefined> {
    return this.users.find(user => user.email === email);
  }

  async createUser(username: string, email: string, hashedPassword: string, avatarUrl?: string): Promise<SelectUser> {
    const user: SelectUser = {
      id: this.nextUserId++,
      username,
      email,
      hashedPassword,
      avatarUrl: avatarUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    }
    return `${hours}h ${mins}m`;
  }

  async getFeed(page: number, limit: number): Promise<{ sessions: FeedSession[]; total: number }> {
    const offset = (page - 1) * limit;
    const sortedSessions = this.sessions
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    
    const paginatedSessions = sortedSessions.slice(offset, offset + limit);
    
    const feedSessions: FeedSession[] = paginatedSessions.map(session => ({
      id: session.id,
      user: {
        id: session.user.id,
        username: session.user.username,
        avatarUrl: session.user.avatarUrl,
      },
      location: session.location,
      createdAt: session.createdAt || new Date(),
      title: session.title,
      stats: {
        totalSends: session.totalSends || 0,
        routesClimbed: session.routesClimbed || 0,
        duration: this.formatDuration(session.durationMinutes),
      },
    }));

    return { sessions: feedSessions, total: this.sessions.length };
  }

  async getSession(sessionId: number): Promise<(SelectSession & { user: SelectUser }) | undefined> {
    return this.sessions.find(s => s.id === sessionId);
  }

  async createSession(userId: number, location: string, title: string, totalSends: number, routesClimbed: number, durationMinutes: number): Promise<SelectSession> {
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    const session = {
      id: this.nextSessionId++,
      userId,
      location,
      title,
      totalSends,
      routesClimbed,
      durationMinutes,
      createdAt: new Date(),
      user,
    };

    this.sessions.push(session);
    return session;
  }

  async updateSession(sessionId: number, userId: number, updates: Partial<InsertSession>): Promise<SelectSession | undefined> {
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId && s.userId === userId);
    
    if (sessionIndex === -1) return undefined;
    
    this.sessions[sessionIndex] = { ...this.sessions[sessionIndex], ...updates };
    return this.sessions[sessionIndex];
  }

  async deleteSession(sessionId: number, userId: number): Promise<boolean> {
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId && s.userId === userId);
    
    if (sessionIndex === -1) return false;
    
    this.sessions.splice(sessionIndex, 1);
    return true;
  }
}

export const db: Database = process.env.DATABASE_URL ? new DrizzleDatabase() : new InMemoryDatabase();