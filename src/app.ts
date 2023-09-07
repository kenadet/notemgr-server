import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import noteRouter from "./routes/notes";
import userRouter from "./routes/users";
import { ConnectionOptions } from "tls";

const app: Express = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/users", userRouter);
app.use("/api/notes", noteRouter);

const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.vnjmqzo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectionOptions;

mongoose
  .connect(uri, dbOptions)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch((error) => {
    throw error;
  });
