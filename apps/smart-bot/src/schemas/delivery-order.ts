import { z } from 'zod';

// The AI is forced to match this shape
export const DeliveryOrderSchema = z.object({
  supplier: z.object({
    name: z.string(),
    address: z.string().optional(),
  }),
  meta: z.object({
    invoice_date: z.string().describe("YYYY-MM-DD"), 
    po_number: z.string().optional(),
  }),
  line_items: z.array(z.object({
    description: z.string(),
    qty: z.number(),
    unit_price: z.number().describe("Float value. Handle precision carefully in math."),
    total: z.number().describe("Float value. Handle precision carefully in math."),
  })),
  confidence: z.number().describe("0.0 to 1.0 score"),
});
