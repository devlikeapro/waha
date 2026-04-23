import { pgTable, serial, text, timestamp, jsonb, index, customType, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Custom type for pgvector (768 dims for text-embedding-004)
const vector768 = customType<{ data: number[] }>({
  dataType() { return 'vector(768)'; },
});

// Custom 512-dim vector for ArcFace (Vision Bot)
const vector512 = customType<{ data: number[] }>({
  dataType() { return 'vector(512)'; },
});

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  sessionId: text('session_id').notNull(), // associated WAHA session
  chatId: text('chat_id').notNull(), // User who uploaded
  
  // New columns for Hybrid Search & Storage
  s3Key: text('s3_key'), // Nullable for migration, but should be filled
  content: text('content'), // Raw text for FTS
  // Google text-embedding-004 is 768 dimensions. Supports Matryoshka slicing (e.g. to 512).
  embedding: vector768('embedding'), 
  metadata: jsonb('metadata'),
}, (table) => ({
  // 1. Vector Index for Semantic Search (HNSW for speed)
  // Requires: CREATE EXTENSION IF NOT EXISTS vector;
  vectorIdx: index('vector_idx').using('hnsw', table.embedding.op('vector_cosine_ops')),
  
  // 2. GIN Index for Full-Text Search on content
  // Requires: CREATE EXTENSION IF NOT EXISTS pg_trgm; (for some ops) or just standard tsvector
  contentFtsIdx: index('content_fts_idx').using('gin', sql`to_tsvector('english', ${table.content})`),
  
  // 3. Composite Index for Metadata Filtering
  metaFilterIdx: index('meta_filter_idx').on(
    sql`(${table.metadata}->>'type')`, 
    sql`(${table.metadata}->>'supplier')`
  ),
}));

export const documentChunks = pgTable('document_chunks', {
  id: serial('id').primaryKey(),
  documentId: integer('document_id').references(() => documents.id),
  content: text('content').notNull(),
  embedding: vector768('embedding'), 
  metadata: jsonb('metadata'),
}, (table) => ({
    chunkVectorIdx: index('chunk_vector_idx').using('hnsw', table.embedding.op('vector_cosine_ops')),
}));

export const extractedData = pgTable('extracted_data', {
  id: serial('id').primaryKey(),
  documentId: integer('document_id').references(() => documents.id),
  type: text('type').notNull(), // 'invoice', 'delivery_order', etc.
  data: jsonb('data').notNull(), // The extracted JSON
  confidence: text('confidence'), // Store as text to allow '0.95' or 'high'
  status: text('status').$type<'pending_review' | 'confirmed' | 'rejected'>().default('pending_review'),
  waMessageId: text('wa_message_id').unique(), // For Idempotency and Polls
  createdAt: timestamp('created_at').defaultNow(),
});

// --- Vision Bot Schema ---

// 1. Workers: Master Identity List
export const workers = pgTable('workers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  company: text('company'),
  status: text('status').default('active'), // active, archived
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Face Templates: The "Face Library" (Multi-shot)
export const faceTemplates = pgTable('face_templates', {
  id: serial('id').primaryKey(),
  workerId: integer('worker_id').references(() => workers.id, { onDelete: 'cascade' }),
  embedding: vector512('embedding').notNull(),
  cropS3Url: text('crop_s3_url').notNull(), // Permanent aligned 112x112 crop
  sourceImageId: text('source_image_id'), // Traceability
}, (table) => ({
  embeddingIdx: index('embedding_hnsw_idx').using('hnsw', table.embedding.op('vector_cosine_ops')),
}));

// 3. Attendance Logs: Every face detected
export const attendanceLogs = pgTable('attendance_logs', {
  id: serial('id').primaryKey(),
  workerId: integer('worker_id').references(() => workers.id), 
  groupId: text('group_id').notNull(), // Group ID for multi-person photos
  rawEmbedding: vector512('raw_embedding'),
  status: text('status').$type<'auto' | 'confirmed' | 'rejected' | 'pending'>().default('pending'),
  imageUrl: text('image_url').notNull(), // Full Image
  cropUrl: text('crop_url'), // Small crop for "Who is this?" messages
  waPollId: text('wa_poll_id').unique(), // Link to WhatsApp Poll Message
  metadata: jsonb('metadata').$type<{
    bbox?: number[];
    score?: number;
    distance?: number;
  }>(), 
  timestamp: timestamp('timestamp').defaultNow(),
}, (table) => ({
  groupIdIdx: index('attendance_group_id_idx').on(table.groupId),
  waPollIdIdx: index('attendance_wa_poll_id_idx').on(table.waPollId),
  statusIdx: index('attendance_status_idx').on(table.status),
  timestampIdx: index('attendance_timestamp_idx').on(table.timestamp),
  workerIdIdx: index('attendance_worker_id_idx').on(table.workerId),
}));

