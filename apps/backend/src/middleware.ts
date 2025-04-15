import { Request, Response, NextFunction } from "express";
import { verifyToken, createClerkClient } from "@clerk/backend";
import { db } from "@repo/db";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
    }
  }
}

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]!;

  try {
    const verify = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY,
      authorizedParties: [
        "https://4094-2406-7400-63-1f87-b482-6ceb-b42b-2ebb.ngrok-free.app",
      ],
    });

    const userId = verify.sub;
    const user = await clerkClient.users.getUser(userId);

    const userCheck = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    );

    if (!userCheck) {
      res.status(400).json({
        error: "User email not found",
      });
      return;
    }

    console.log("userId userId: ", userId);

    /* this is clerk id tech.. */
    req.user = {
      id: userId,
      email: userCheck.emailAddress,
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Invalid user",
    });
    return;
  }
};
