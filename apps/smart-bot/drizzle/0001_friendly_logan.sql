CREATE TABLE "extracted_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"type" text NOT NULL,
	"data" jsonb NOT NULL,
	"confidence" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "extracted_data" ADD CONSTRAINT "extracted_data_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;