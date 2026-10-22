import { z } from "zod";

export const productInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z.string().trim().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().trim().min(1, "Category is required"),
  categorySlug: z.string().trim().min(1, "Category slug is required"),
  featured: z.boolean().optional().default(false),
  isDeal: z.boolean().optional().default(false),
  is_deal: z.boolean().optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).optional().default([]),
  condition: z.string().trim().max(50).optional().nullable(),
  location: z.string().trim().max(100).optional().default("Entebbe"),
  seller: z.object({ name: z.string().optional(), phone: z.string().optional(), whatsapp: z.string().optional(), verified: z.boolean().optional(), memberSince: z.string().optional() }).optional().default({}),
  images: z.array(z.string().url()).optional().default([]),
  daysAgo: z.coerce.number().int().min(0).optional().default(0),
  timeAgo: z.string().trim().max(50).optional().default("Just now"),
  user_id: z.string().uuid().nullable().optional(),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const pushSubscribeSchema = z.object({
  endpoint: z.string().url("Invalid endpoint"),
  keys: z.object({
    p256dh: z.string().min(1, "Missing p256dh"),
    auth: z.string().min(1, "Missing auth"),
  }),
});

export const pushNotifySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  body: z.string().trim().max(300).optional(),
  url: z.string().max(500).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});