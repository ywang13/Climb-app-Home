import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { desc, eq } from "drizzle-orm";
import type { SelectUser, SelectGym, SelectSession, TimelineSession } from "../shared/schema";
import { users, gyms, sessions } from "../shared/schema";

export interface Database {
  getUser(id: number): Promise<SelectUser | undefined>;
  createUser(username: string, password: string, profilePicture?: string): Promise<SelectUser>;
  getTimeline(): Promise<TimelineSession[]>;
  createSession(userId: number, gymId: number, title: string, description: string | null, totalSend: number, routesClimbed: number, duration: number): Promise<SelectSession>;
  getGyms(): Promise<SelectGym[]>;
  createGym(name: string, location: string): Promise<SelectGym>;
}

class DrizzleDatabase implements Database {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql, { schema: { users, gyms, sessions } });
  }

  async getUser(id: number): Promise<SelectUser | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async createUser(username: string, password: string, profilePicture?: string): Promise<SelectUser> {
    const result = await this.db.insert(users).values({
      username,
      password,
      profilePicture,
    }).returning();
    return result[0];
  }

  async getTimeline(): Promise<TimelineSession[]> {
    const result = await this.db
      .select({
        id: sessions.id,
        title: sessions.title,
        description: sessions.description,
        totalSend: sessions.totalSend,
        routesClimbed: sessions.routesClimbed,
        duration: sessions.duration,
        createdAt: sessions.createdAt,
        user: {
          id: users.id,
          username: users.username,
          profilePicture: users.profilePicture,
        },
        gym: {
          id: gyms.id,
          name: gyms.name,
          location: gyms.location,
        },
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .innerJoin(gyms, eq(sessions.gymId, gyms.id))
      .orderBy(desc(sessions.createdAt));

    return result.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      totalSend: row.totalSend || 0,
      routesClimbed: row.routesClimbed || 0,
      duration: row.duration,
      createdAt: row.createdAt || new Date(),
      user: row.user,
      gym: row.gym,
    }));
  }

  async createSession(
    userId: number,
    gymId: number,
    title: string,
    description: string | null,
    totalSend: number,
    routesClimbed: number,
    duration: number
  ): Promise<SelectSession> {
    const result = await this.db.insert(sessions).values({
      userId,
      gymId,
      title,
      description,
      totalSend,
      routesClimbed,
      duration,
    }).returning();
    return result[0];
  }

  async getGyms(): Promise<SelectGym[]> {
    return await this.db.select().from(gyms);
  }

  async createGym(name: string, location: string): Promise<SelectGym> {
    const result = await this.db.insert(gyms).values({
      name,
      location,
    }).returning();
    return result[0];
  }
}

class InMemoryDatabase implements Database {
  private users: SelectUser[] = [];
  private gyms: SelectGym[] = [
    { id: 1, name: "Movement Santa Clara", location: "Santa Clara", createdAt: new Date() },
    { id: 2, name: "Movement Sunnyvale", location: "Sunnyvale", createdAt: new Date() },
    { id: 3, name: "Movement Berkeley", location: "Berkeley", createdAt: new Date() },
  ];
  private sessions: (SelectSession & { user: SelectUser; gym: SelectGym })[] = [];
  private nextUserId = 1;
  private nextGymId = 4;
  private nextSessionId = 1;

  constructor() {
    // Add sample users
    this.users = [
      {
        id: 1,
        username: "alex_climber",
        password: "password",
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        createdAt: new Date(),
      },
      {
        id: 2,
        username: "sarah_sends",
        password: "password",
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100&h=100&fit=crop&crop=face",
        createdAt: new Date(),
      },
      {
        id: 3,
        username: "mike_boulder",
        password: "password",
        profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        createdAt: new Date(),
      },
    ];
    this.nextUserId = 4;

    // Add sample sessions
    const now = new Date();
    const today = new Date(now);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    this.sessions = [
      {
        id: 1,
        userId: 1,
        gymId: 1,
        title: "Great bouldering session!",
        description: "Worked on some V4s and finally sent that crimpy overhang problem",
        totalSend: 8,
        routesClimbed: 12,
        duration: 116, // 1h 56m
        createdAt: today,
        user: this.users[0],
        gym: this.gyms[0],
      },
      {
        id: 2,
        userId: 2,
        gymId: 2,
        title: "Top rope training",
        description: "Focused on endurance routes and technique work",
        totalSend: 6,
        routesClimbed: 8,
        duration: 90, // 1h 30m
        createdAt: yesterday,
        user: this.users[1],
        gym: this.gyms[1],
      },
      {
        id: 3,
        userId: 3,
        gymId: 1,
        title: "Quick lunch session",
        description: "Short but productive boulder session",
        totalSend: 4,
        routesClimbed: 6,
        duration: 45, // 45m
        createdAt: twoDaysAgo,
        user: this.users[2],
        gym: this.gyms[0],
      },
    ];
    this.nextSessionId = 4;
  }

  async getUser(id: number): Promise<SelectUser | undefined> {
    return this.users.find(user => user.id === id);
  }

  async createUser(username: string, password: string, profilePicture?: string): Promise<SelectUser> {
    const user: SelectUser = {
      id: this.nextUserId++,
      username,
      password,
      profilePicture: profilePicture || null,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async getTimeline(): Promise<TimelineSession[]> {
    return this.sessions
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .map(session => ({
        id: session.id,
        title: session.title,
        description: session.description,
        totalSend: session.totalSend || 0,
        routesClimbed: session.routesClimbed || 0,
        duration: session.duration,
        createdAt: session.createdAt || new Date(),
        user: {
          id: session.user.id,
          username: session.user.username,
          profilePicture: session.user.profilePicture,
        },
        gym: {
          id: session.gym.id,
          name: session.gym.name,
          location: session.gym.location,
        },
      }));
  }

  async createSession(
    userId: number,
    gymId: number,
    title: string,
    description: string | null,
    totalSend: number,
    routesClimbed: number,
    duration: number
  ): Promise<SelectSession> {
    const user = this.users.find(u => u.id === userId);
    const gym = this.gyms.find(g => g.id === gymId);
    
    if (!user || !gym) {
      throw new Error("User or gym not found");
    }

    const session = {
      id: this.nextSessionId++,
      userId,
      gymId,
      title,
      description,
      totalSend,
      routesClimbed,
      duration,
      createdAt: new Date(),
      user,
      gym,
    };

    this.sessions.push(session);
    return session;
  }

  async getGyms(): Promise<SelectGym[]> {
    return this.gyms;
  }

  async createGym(name: string, location: string): Promise<SelectGym> {
    const gym: SelectGym = {
      id: this.nextGymId++,
      name,
      location,
      createdAt: new Date(),
    };
    this.gyms.push(gym);
    return gym;
  }
}

export const db: Database = process.env.DATABASE_URL ? new DrizzleDatabase() : new InMemoryDatabase();