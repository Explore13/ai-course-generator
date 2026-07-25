import { pgTable, serial, json, varchar, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const CourseList = pgTable("courseList", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  level: varchar("level").notNull(),
  includeVideo: varchar("includeVideo").notNull().default("Yes"),
  courseOutput: json("courseOutput").notNull(),
  createdBy: varchar("createdBy").notNull(),
  userName: varchar("username"),
  userProfileImage: varchar("userProfileImage"),
  courseBanner: varchar("courseBanner").default("/placeholder.png"),
  publish: boolean("publish").default(false),
});

export const Chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  chapterId: varchar("chapterId").notNull(),
  content: json("content").notNull(),
  videoId: json("videoId").notNull().$default("[]"),
});

export const LaunchNotifications = pgTable("launch_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id").notNull().unique(),
  email: varchar("email").notNull().unique(),
  notifyMe: boolean("notify_me").notNull().default(false),
  notificationSent: boolean("notification_sent").default(false),
  notificationSentAt: timestamp("notification_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
