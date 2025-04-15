import z from "zod";

// durationMinuts: slot/time reserved
export const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  scheduledDate: z.date(),
  durationMins: z.number(),
});

export const promptSchema = z.object({
  prompt: z.string(),
});

export type NewTask = z.infer<typeof taskSchema>;
