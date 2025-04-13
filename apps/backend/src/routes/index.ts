import { Router } from "express";
const router: Router = Router();

import { userRouter } from "./user";
import { taskRouter } from "./task";

// v1/user/
// v1/task/
router.use("/user", userRouter);
router.use("/task", taskRouter);

export { router };
