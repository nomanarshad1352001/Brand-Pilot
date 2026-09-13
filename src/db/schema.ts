import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const vendorStatusEnum = pgEnum("vendor_status", [
  "prospect",
  "contacted",
  "negotiating",
  "application_sent",
  "approved",
  "rejected",
  "on_hold",
]);

export const vendorTypeEnum = pgEnum("vendor_type", [
  "manufacturer",
  "distributor",
  "brand",
]);

export const activityTypeEnum = pgEnum("activity_type", [
  "email_sent",
  "email_received",
  "call_made",
  "call_received",
  "meeting",
  "note",
  "follow_up_scheduled",
  "status_change",
  "application_submitted",
  "pricing_sheet_received",
]);

export const priorityEnum = pgEnum("priority", ["low", "medium", "high", "urgent"]);

export const followUpStatusEnum = pgEnum("follow_up_status", [
  "pending",
  "completed",
  "cancelled",
  "rescheduled",
]);

// Vendors table (brands/manufacturers/distributors)
export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: vendorTypeEnum("type").notNull().default("brand"),
  status: vendorStatusEnum("status").notNull().default("prospect"),
  website: varchar("website", { length: 500 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  contactName: varchar("contact_name", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  contactTitle: varchar("contact_title", { length: 100 }),
  notes: text("notes"),
  amazonCategories: text("amazon_categories"), // JSON array stored as text
  estimatedRevenue: decimal("estimated_revenue", { precision: 15, scale: 2 }),
  priority: priorityEnum("priority").default("medium"),
  pipelineStage: integer("pipeline_stage").default(0),
  hasPricingSheet: boolean("has_pricing_sheet").default(false),
  hasApplication: boolean("has_application").default(false),
  applicationDate: timestamp("application_date"),
  approvalDate: timestamp("approval_date"),
  lastContactDate: timestamp("last_contact_date"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Pipeline stages for Kanban board
export const pipelineStages = pgTable("pipeline_stages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#6366f1"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activities/Communication log
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id, { onDelete: "cascade" }),
  type: activityTypeEnum("type").notNull(),
  subject: varchar("subject", { length: 500 }),
  content: text("content"),
  metadata: text("metadata"), // JSON for storing email IDs, call durations, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Follow-ups
export const followUps = pgTable("follow_ups", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  status: followUpStatusEnum("status").notNull().default("pending"),
  priority: priorityEnum("priority").default("medium"),
  reminderSent: boolean("reminder_sent").default(false),
  calendarEventId: varchar("calendar_event_id", { length: 255 }), // Google Calendar event ID
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Email templates
export const emailTemplates = pgTable("email_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  body: text("body").notNull(),
  category: varchar("category", { length: 100 }), // e.g., "initial_outreach", "follow_up", "application"
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// KPI snapshots for tracking metrics over time
export const kpiSnapshots = pgTable("kpi_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull(),
  totalVendors: integer("total_vendors").default(0),
  newProspects: integer("new_prospects").default(0),
  emailsSent: integer("emails_sent").default(0),
  callsMade: integer("calls_made").default(0),
  applicationsSent: integer("applications_sent").default(0),
  accountsApproved: integer("accounts_approved").default(0),
  pricingSheetsReceived: integer("pricing_sheets_received").default(0),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Call logs for Twilio integration
export const callLogs = pgTable("call_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id, { onDelete: "cascade" }),
  twilioCallSid: varchar("twilio_call_sid", { length: 255 }),
  fromNumber: varchar("from_number", { length: 50 }),
  toNumber: varchar("to_number", { length: 50 }),
  direction: varchar("direction", { length: 20 }), // inbound/outbound
  status: varchar("status", { length: 50 }),
  duration: integer("duration"), // in seconds
  recordingUrl: varchar("recording_url", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email communications
export const emails = pgTable("emails", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id, { onDelete: "cascade" }),
  gmailMessageId: varchar("gmail_message_id", { length: 255 }),
  gmailThreadId: varchar("gmail_thread_id", { length: 255 }),
  direction: varchar("direction", { length: 20 }).notNull(), // sent/received
  fromEmail: varchar("from_email", { length: 255 }),
  toEmail: varchar("to_email", { length: 255 }),
  subject: varchar("subject", { length: 500 }),
  body: text("body"),
  htmlBody: text("html_body"),
  isRead: boolean("is_read").default(false),
  templateId: uuid("template_id").references(() => emailTemplates.id),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Calendar events
export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }),
  googleEventId: varchar("google_event_id", { length: 255 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: varchar("location", { length: 500 }),
  attendees: text("attendees"), // JSON array
  meetingLink: varchar("meeting_link", { length: 500 }),
  reminderMinutes: integer("reminder_minutes").default(30),
  isSynced: boolean("is_synced").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Settings for integrations
export const integrationSettings = pgTable("integration_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider: varchar("provider", { length: 50 }).notNull(), // gmail, google_calendar, twilio
  isEnabled: boolean("is_enabled").default(false),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  metadata: text("metadata"), // JSON for additional settings
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types for use in the application
export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
export type FollowUp = typeof followUps.$inferSelect;
export type NewFollowUp = typeof followUps.$inferInsert;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type NewEmailTemplate = typeof emailTemplates.$inferInsert;
export type PipelineStage = typeof pipelineStages.$inferSelect;
export type Email = typeof emails.$inferSelect;
export type CallLog = typeof callLogs.$inferSelect;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
