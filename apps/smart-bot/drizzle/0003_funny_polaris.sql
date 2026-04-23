CREATE TABLE "attendance_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_id" integer,
	"group_id" text NOT NULL,
	"raw_embedding" vector(512),
	"status" text DEFAULT 'pending',
	"s3_url" text NOT NULL,
	"crop_s3_url" text,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "face_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_id" integer,
	"embedding" vector(512) NOT NULL,
	"crop_s3_url" text NOT NULL,
	"source_image_id" text
);
--> statement-breakpoint
CREATE TABLE "workers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company" text,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "document_chunks" ALTER COLUMN "document_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "document_chunks" ALTER COLUMN "document_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "extracted_data" ALTER COLUMN "document_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "extracted_data" ALTER COLUMN "document_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_logs" ADD CONSTRAINT "attendance_logs_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "face_templates" ADD CONSTRAINT "face_templates_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embedding_hnsw_idx" ON "face_templates" USING hnsw ("embedding" vector_cosine_ops);