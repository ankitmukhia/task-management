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
  } catch (err) {
    console.error(err);
  }
});

taskRouter.delete(
  "/task",
  userMiddleware,
  async (req: Request, res: Response) => {
    const user = req.user;
    const { task_id } = req.body;

    try {
      const taskExists = await db.task.findUnique({
        where: {
          id: task_id,
        },
        select: {
          id: true,
        },
      });

      if (!taskExists) {
        res.status(400).json({
          status: "error",
          error: "Task doesn't exists!",
        });
        return;
      }

      const taskDelete = await db.task.delete({
        where: {
          userId: user.id,
          id: taskExists.id,
        },
      });

      if (!taskDelete) {
        res.status(400).json({
          status: "error",
          error: "Error deleting task.",
        });
        return;
      }

      res.status(200).json({
        message: "Task removed successfully!",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "",
      });
    }
  },
);

taskRouter.patch(
  "/task",
  userMiddleware,
  async (req: Request, res: Response) => {
    const user = req.user;
    const {
      task_id,
      title,
      description,
      scheduledDate,
      durationMins,
      priority,
      status,
    } = req.body;

    try {
      const taskExists = await db.task.findUnique({
        where: {
          id: task_id,
        },
        select: {
          id: true,
        },
      });

      if (!taskExists) {
        res.status(400).json({
          status: "error",
          error: "Task doesn't exists!",
        });
        return;
      }

      const taskPatch = await db.task.update({
        where: {
          userId: user.id,
          id: taskExists.id,
        },
        data: {
          title,
          description,
          scheduledDate,
          durationMins,
          priority,
          status,
        },
      });

      if (!taskPatch) {
        res.status(400).json({
          status: "error",
          error: "Error updating task.",
        });
        return;
      }

      res.status(200).json({
        message: "Task updated successfully.",
      });
    } catch (err) {
      console.error(err);
    }
  },
);

export { taskRouter };
