ALTER TABLE "attendance_logs" ADD COLUMN "wa_poll_id" text;--> statement-breakpoint
ALTER TABLE "attendance_logs" ADD CONSTRAINT "attendance_logs_wa_poll_id_unique" UNIQUE("wa_poll_id");