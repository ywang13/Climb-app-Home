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

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
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

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;

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