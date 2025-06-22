import type { Express } from "express";
import { createServer } from "http";
import { db } from "./storage";
import { z } from "zod";

export function registerRoutes(app: Express) {
  const server = createServer(app);

  // Timeline endpoint
  app.get("/api/timeline", async (req, res) => {
    try {
      const timeline = await db.getTimeline();
      res.json(timeline);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ error: "Failed to fetch timeline" });
    }
  });

  // Get gyms endpoint
  app.get("/api/gyms", async (req, res) => {
    try {
      const gyms = await db.getGyms();
      res.json(gyms);
    } catch (error) {
      console.error("Error fetching gyms:", error);
      res.status(500).json({ error: "Failed to fetch gyms" });
    }
  });

  // Create session endpoint
  const createSessionSchema = z.object({
    userId: z.number(),
    gymId: z.number(),
    title: z.string(),
    description: z.string().nullable().optional(),
    totalSend: z.number().default(0),
    routesClimbed: z.number().default(0),
    duration: z.number(), // in minutes
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const data = createSessionSchema.parse(req.body);
      const session = await db.createSession(
        data.userId,
        data.gymId,
        data.title,
        data.description || null,
        data.totalSend,
        data.routesClimbed,
        data.duration
      );
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create session" });
      }
    }
  });

  // Create user endpoint
  const createUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    profilePicture: z.string().optional(),
  });

  app.post("/api/users", async (req, res) => {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await db.createUser(data.username, data.password, data.profilePicture);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  // Get user endpoint
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const user = await db.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  return server;
}