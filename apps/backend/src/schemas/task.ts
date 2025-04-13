import z from "zod";

export const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  scheduledDate: z.date(),
  durationMins: z.number(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export type NewTask = z.infer<typeof taskSchema>;
