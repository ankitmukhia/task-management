import express, { Express } from "express";
import cors from "cors";
import "dotenv/config";

import { router } from "./routes";

const PORT = process.env.PORT ?? 3000;
const app: Express = express();
app.use(express.json());
app.use(cors());

app.use("/v1", router);

app
  .listen(PORT, () => {
    console.log(`App is listening at PORT ${PORT}`);
  })
  .on("error", (err) => {
    console.error(err);
  });
