CREATE TABLE IF NOT EXISTS "chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" varchar NOT NULL,
	"chapterId" varchar NOT NULL,
	"content" json NOT NULL,
	"videoId" json NOT NULL
);
--> statement-breakpoint
ALTER TABLE "courseList" ADD COLUMN "includeVideo" varchar DEFAULT 'Yes' NOT NULL;--> statement-breakpoint
ALTER TABLE "courseList" ADD COLUMN "courseBanner" varchar DEFAULT '/placeholder.png';--> statement-breakpoint
ALTER TABLE "courseList" ADD COLUMN "publish" boolean DEFAULT false;