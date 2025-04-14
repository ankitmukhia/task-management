import express, { Express } from "express";
import { router } from "./routes";
import cors from "cors";
import "dotenv/config";
const app: Express = express();

const PORT = process.env.PORT ?? 3000;
app.use(express.json());
app.use(cors());

app.use("/v1/api", router);

app
  .listen(PORT, () => {
    console.log(`App is listening at PORT ${PORT}`);
  })
  .on("error", (err) => {
    console.error(err);
  });
