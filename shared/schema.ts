import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  hashedPassword: text("hashed_password").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gyms = pgTable("gyms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  location: text("location").notNull(),
  title: text("title").notNull(),
  totalSends: integer("total_sends").default(0),
  routesClimbed: integer("routes_climbed").default(0),
  durationMinutes: integer("duration_minutes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id).notNull(),
  url: text("url").notNull(),
  type: text("type", { enum: ["photo", "video"] }).notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // in seconds for videos, null for photos
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  media: many(media),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  session: one(sessions, {
    fields: [media.sessionId],
    references: [sessions.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const selectUserSchema = createSelectSchema(users);
export const insertSessionSchema = createInsertSchema(sessions).omit({ 
  id: true, 
  createdAt: true 
});
export const selectSessionSchema = createSelectSchema(sessions);
export const insertMediaSchema = createInsertSchema(media).omit({ 
  id: true, 
  createdAt: true 
});
export const selectMediaSchema = createSelectSchema(media);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;
export type SelectMedia = typeof media.$inferSelect;

export type SessionMedia = {
  id: number;
  url: string;
  type: "photo" | "video";
  thumbnailUrl: string | null;
  duration: number | null; // in seconds for videos
};

export type FeedSession = {
  id: number;
  user: {
    id: number;
    username: string;
    avatarUrl: string | null;
  };
  location: string;
  createdAt: Date;
  title: string;
  stats: {
    totalSends: number;
    routesClimbed: number;
    duration: string; // formatted as "Xh Ym"
  };
  media: SessionMedia[];
};

export type FeedResponse = {
  sessions: FeedSession[];
  pagination: {
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
};

// Login/Register schemas
export const registerUserSchema = insertUserSchema.extend({
  password: insertUserSchema.shape.hashedPassword, // Will be hashed on server
}).omit({ hashedPassword: true });

export const loginUserSchema = registerUserSchema.pick({
  email: true,
  password: true,
});

export type RegisterUser = typeof registerUserSchema._input;
export type LoginUser = typeof loginUserSchema._input;