CREATE TABLE "logos" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"keywords" text DEFAULT '' NOT NULL,
	"mime" text NOT NULL,
	"data" text NOT NULL,
	"accent" text DEFAULT '#6D5DF6' NOT NULL,
	"source" text DEFAULT 'upload' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "apps" ADD COLUMN "logo_id" integer;--> statement-breakpoint
ALTER TABLE "apps" ADD CONSTRAINT "apps_logo_id_logos_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."logos"("id") ON DELETE set null ON UPDATE no action;