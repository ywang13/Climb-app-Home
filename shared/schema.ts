import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow(),
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
  gymId: integer("gym_id").references(() => gyms.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  totalSend: integer("total_send").default(0),
  routesClimbed: integer("routes_climbed").default(0),
  duration: integer("duration_minutes").notNull(), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const gymsRelations = relations(gyms, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  gym: one(gyms, {
    fields: [sessions.gymId],
    references: [gyms.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertGymSchema = createInsertSchema(gyms);
export const selectGymSchema = createSelectSchema(gyms);
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertGym = typeof gyms.$inferInsert;
export type SelectGym = typeof gyms.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;

export type TimelineSession = {
  id: number;
  title: string;
  description: string | null;
  totalSend: number;
  routesClimbed: number;
  duration: number;
  createdAt: Date;
  user: {
    id: number;
    username: string;
    profilePicture: string | null;
  };
  gym: {
    id: number;
    name: string;
    location: string;
  };
};