import { Router, Request, Response } from "express";
import { Task } from "@repo/db";
const taskRouter: Router = Router();

import { taskSchema } from "../schemas/task";
import { userMiddleware } from "../middleware";
import { db } from "@repo/db";

// v1/task/create-task
taskRouter.post(
  "/create-task",
  userMiddleware,
  async (req: Request, res: Response) => {
    const user = req.user;
    const {
      title,
      description,
      scheduledDate,
      priority,
      status,
      durationMins,
    } = req.body as Task;

    const { success, error, data } = taskSchema.safeParse({
      title,
      description,
      scheduledDate,
      durationMins,
      priority,
      status,
    });

    const formattedError = error?.format();

    if (!success) {
      res.status(400).json({
        status: "error",
        message: "Invalid task.",
        error: formattedError,
      });
      return;
    }

    // prisma update || create
    const task = await db.task.upsert({
      create: {
        title: data.title,
        description: data.description,
        scheduledDate: data.scheduledDate,
        durationMins: data.durationMins,
        priority: data.priority,
        status: data.status,
      },
      update: {},
      where: {
        id: user.id,
      },
    });

    if (!task) {
      res.status(500).json({
        status: "error",
        message: "Failed creating task! try again",
      });
      return;
    }

    res.status(201).json({
      message: "Task created successfully.",
    });
  },
);

taskRouter.get("/tasks", async (req: Request, res: Response) => {
  const userId = req.user.id;

  try {
    const tasks = await db.task.findMany({
      where: {
        userId,
      },
    });

    if (!tasks) {
      res.status(500).json({
        status: "error",
        message: "Failed to get tasks. Try again!",
      });
      return;
    }

    res.status(200).json({
      tasks,
    });
  } catch (err) {}
});

taskRouter.delete("/task", (req: Request, res: Response) => {
  const { task_id } = req.body;

  // check if that task exists
  // and task belong to the user
  // Now delte that given task
});

taskRouter.patch("/task", (req: Request, res: Response) => {
  const { task_id } = req.body;

  // check if that task exists
  // and task belong to the user
  // Now update/patch specific table value.
});

export { taskRouter };
