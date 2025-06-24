import type { Express } from "express";
import { createServer } from "http";
import { db } from "./storage";
import { z } from "zod";
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  authenticateToken, 
  optionalAuth,
  type AuthenticatedRequest 
} from "./auth";
import { 
  registerUserSchema, 
  loginUserSchema, 
  insertSessionSchema,
  type FeedResponse 
} from "../shared/schema";

export function registerRoutes(app: Express) {
  const server = createServer(app);

  // ==================== USER ENDPOINTS ====================

  // POST /api/users/register - Register new user
  app.post("/api/users/register", async (req, res) => {
    try {
      const data = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await db.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(data.password);
      const user = await db.createUser(data.username, data.email, hashedPassword, data.avatarUrl);
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Return user without password
      const { hashedPassword: _, ...userWithoutPassword } = user;
      res.status(201).json({ 
        user: userWithoutPassword, 
        token 
      });
    } catch (error) {
      console.error("Error registering user:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to register user" });
      }
    }
  });

  // POST /api/users/login - Login user
  app.post("/api/users/login", async (req, res) => {
    try {
      const data = loginUserSchema.parse(req.body);
      
      // Find user by email
      const user = await db.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await verifyPassword(data.password, user.hashedPassword);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate JWT token
      const token = generateToken(user);
      
      // Return user without password
      const { hashedPassword: _, ...userWithoutPassword } = user;
      res.json({ 
        user: userWithoutPassword, 
        token 
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to login user" });
      }
    }
  });

  // GET /api/users/me - Get current user
  app.get("/api/users/me", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await db.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { hashedPassword: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // GET /api/users/:userId - Get user profile
  app.get("/api/users/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await db.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return public user info (no email or password)
      const { hashedPassword: _, email: __, ...publicUser } = user;
      res.json(publicUser);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // ==================== FEED ENDPOINT ====================

  // GET /api/feed - Returns paginated climbing sessions with user info
  app.get("/api/feed", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({ error: "Invalid pagination parameters" });
      }

      const { sessions, total } = await db.getFeed(page, limit);
      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;

      const response: FeedResponse = {
        sessions,
        pagination: {
          page,
          totalPages,
          hasMore,
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching feed:", error);
      res.status(500).json({ error: "Failed to fetch feed" });
    }
  });

  // ==================== SESSION ENDPOINTS ====================

  // POST /api/sessions - Create new session (authenticated)
  const createSessionSchema = insertSessionSchema.extend({
    location: z.string().min(1),
    title: z.string().min(1),
    totalSends: z.number().min(0).default(0),
    routesClimbed: z.number().min(0).default(0),
    durationMinutes: z.number().min(1),
  });

  app.post("/api/sessions", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const data = createSessionSchema.parse(req.body);
      const session = await db.createSession(
        req.user!.id,
        data.location,
        data.title,
        data.totalSends,
        data.routesClimbed,
        data.durationMinutes
      );
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create session" });
      }
    }
  });

  // GET /api/sessions/:sessionId - Get session details
  app.get("/api/sessions/:sessionId", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      if (isNaN(sessionId)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }

      const session = await db.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Remove sensitive user data
      const { hashedPassword: _, email: __, ...publicUser } = session.user;
      res.json({ ...session, user: publicUser });
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // PUT /api/sessions/:sessionId - Update session (authenticated, owner only)
  const updateSessionSchema = createSessionSchema.partial().omit({ userId: true });

  app.put("/api/sessions/:sessionId", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      if (isNaN(sessionId)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }

      const data = updateSessionSchema.parse(req.body);
      const session = await db.updateSession(sessionId, req.user!.id, data);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found or unauthorized" });
      }

      res.json(session);
    } catch (error) {
      console.error("Error updating session:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update session" });
      }
    }
  });

  // DELETE /api/sessions/:sessionId - Delete session (authenticated, owner only)
  app.delete("/api/sessions/:sessionId", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      if (isNaN(sessionId)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }

      const deleted = await db.deleteSession(sessionId, req.user!.id);
      if (!deleted) {
        return res.status(404).json({ error: "Session not found or unauthorized" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ error: "Failed to delete session" });
    }
  });

  // Legacy timeline endpoint for backwards compatibility
  app.get("/api/timeline", async (req, res) => {
    try {
      const { sessions } = await db.getFeed(1, 20);
      // Transform to legacy format for compatibility
      const legacyFormat = sessions.map(session => ({
        id: session.id,
        title: session.title,
        description: null, // No description in new schema
        totalSend: session.stats.totalSends,
        routesClimbed: session.stats.routesClimbed,
        duration: parseInt(session.stats.duration.replace(/[^\d]/g, '')) || 0, // Extract minutes
        createdAt: session.createdAt,
        user: {
          id: session.user.id,
          username: session.user.username,
          profilePicture: session.user.avatarUrl,
        },
        gym: {
          id: 1, // Dummy gym ID for compatibility
          name: "Unknown Gym",
          location: session.location,
        },
      }));
      res.json(legacyFormat);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ error: "Failed to fetch timeline" });
    }
  });

  return server;
}