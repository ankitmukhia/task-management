import z from "zod";

export const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  /* priority: z.string() */
  due_date: z.date(),
});

export type NewTask = z.infer<typeof taskSchema>;
