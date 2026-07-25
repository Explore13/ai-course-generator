CREATE TABLE IF NOT EXISTS "launch_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"notify_me" boolean DEFAULT false NOT NULL,
	"notification_sent" boolean DEFAULT false,
	"notification_sent_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "launch_notifications_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "launch_notifications_email_unique" UNIQUE("email")
);
