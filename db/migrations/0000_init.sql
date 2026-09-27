CREATE TYPE "public"."badge" AS ENUM('new', 'updated');--> statement-breakpoint
CREATE TYPE "public"."framework" AS ENUM('flutter', 'rn');--> statement-breakpoint
CREATE TYPE "public"."screen_status" AS ENUM('draft', 'building', 'live', 'failed');--> statement-breakpoint
CREATE TYPE "public"."tone" AS ENUM('light', 'dark');--> statement-breakpoint
CREATE TABLE "apps" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"accent" text DEFAULT '#6D5DF6' NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "apps_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "screen_props" (
	"id" serial PRIMARY KEY NOT NULL,
	"screen_id" integer NOT NULL,
	"name" text NOT NULL,
	"flutter_type" text NOT NULL,
	"rn_type" text NOT NULL,
	"default_value" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screen_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"screen_id" integer NOT NULL,
	"framework" "framework" NOT NULL,
	"files" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"highlighted" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"usage" text DEFAULT '' NOT NULL,
	"deps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rn_bundle_url" text,
	"version" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screen_tags" (
	"screen_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "screen_tags_screen_id_tag_id_pk" PRIMARY KEY("screen_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "screens" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_id" integer NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"label" text NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"tone" "tone" DEFAULT 'dark' NOT NULL,
	"badge" "badge",
	"is_pro" boolean DEFAULT false NOT NULL,
	"status" "screen_status" DEFAULT 'draft' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"parity_score" integer,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "screens_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "screen_props" ADD CONSTRAINT "screen_props_screen_id_screens_id_fk" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screen_sources" ADD CONSTRAINT "screen_sources_screen_id_screens_id_fk" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screen_tags" ADD CONSTRAINT "screen_tags_screen_id_screens_id_fk" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screen_tags" ADD CONSTRAINT "screen_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screens" ADD CONSTRAINT "screens_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "screen_sources_screen_framework" ON "screen_sources" USING btree ("screen_id","framework");