import dotenv from "dotenv";
import express, { Request, Response } from "express";
import morgan from "morgan";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
} from "./controllers/planets.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server listening on port ${process.env.PORT}. Link: http://localhost:${process.env.PORT}`
  );
});
