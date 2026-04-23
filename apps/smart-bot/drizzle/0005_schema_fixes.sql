-- Rename columns for consistency (s3_url -> image_url, crop_s3_url -> crop_url)
ALTER TABLE "attendance_logs" RENAME COLUMN "s3_url" TO "image_url";--> statement-breakpoint
ALTER TABLE "attendance_logs" RENAME COLUMN "crop_s3_url" TO "crop_url";--> statement-breakpoint
-- Add index on group_id for faster queries
CREATE INDEX IF NOT EXISTS "attendance_group_id_idx" ON "attendance_logs" ("group_id");
