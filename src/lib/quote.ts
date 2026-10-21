import { z } from "zod";
export const quoteSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s().-]{7,25}$/),
  city: z.string().trim().min(2).max(100),
  type: z.enum(["0", "1", "2", "3", "4", "5"]),
  service: z.enum(["0", "1", "2", "3", "4", "5"]),
  dimensions: z.string().trim().max(200),
  details: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  locale: z.enum(["fr", "en", "ar"]),
  website: z.string().max(0),
});
