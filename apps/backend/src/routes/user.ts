import { Router, Request, Response } from "express";
const userRouter: Router = Router();

userRouter.post("/create", (req: Request, res: Response) => {
  res.send("user handler");
});

export { userRouter };
