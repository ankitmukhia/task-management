import "dotenv/config";
import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { userMiddleware } from "../middleware";
import { db, Task } from "@repo/db";
import z from "zod";

const aiRouter: Router = Router();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function formattedPrompt(tasks: Task[], prompt: string) {
  const grouped: Record<string, string[]> = {};

  tasks.forEach((task) => {
    const start = new Date(task.scheduledDate);
    const end = new Date(start.getTime() + task.durationMins * 60000);
    const dateStr = start.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const timeStr = `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    const taskStr = `• ${timeStr}: ${task.title} (${task.priority} Priority, ${task.status})`;

    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(taskStr);
  });

  const contentTask = Object.entries(grouped)
    .map(([date, tasks]) => `${date}:\n${tasks.join("\n")}`)
    .join("\n\n");
  return `
		Here is my current schedule.

			${contentTask}

		User Query: ${prompt}

		Please analyze the above schedule and determine:
	`.trim();
}

aiRouter.post(
  "/prompt",
  userMiddleware,
  async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const { id } = req.user;
    const { prompt } = req.body;

    const { success, error, data } = z
      .object({
        prompt: z.string(),
      })
      .safeParse({
        prompt,
      });

    const formattedError = error?.format();

    if (!success) {
      res.status(400).json({
        status: "error",
        message: "Promt is not constructed.",
        error: formattedError,
      });
      return;
    }

    try {
      const user = await db.user.findUnique({
        where: {
          clerkId: id,
        },
      });

      if (!user) {
        res.status(500).json({
          error: "error",
          message: "User not found",
        });
        return;
      }

      const tasks = await db.task.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          id: "asc",
        },
      });

      if (!tasks) {
        res.status(500).json({
          status: "error",
          message: "Failed to get tasks. Try again!",
        });
        return;
      }

      const newPrompt = formattedPrompt(tasks, prompt);

      console.log("new formated prompt: ", newPrompt);

      const chat = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: newPrompt,
        config: {
          maxOutputTokens: 5000,
        },
      });

      for await (const chunk of chat) {
        const text = chunk.text;
        console.log("LLM res: ", text);
        res.write(text);
      }

      res.end();
    } catch (err) {
      console.error(err);
      console.log(err);
    }
  },
);

export { aiRouter };
