import dotenv from "dotenv";
import express, { Request, Response } from "express";
import morgan from "morgan";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} from "./controllers/planets.js";

import { login, logout, signup } from "./controllers/users.js";
import { authorize } from "./authorize.js";
import "./passport.js";

import multer = require("multer");

dotenv.config();

const app = express();
app.use(express.json());

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(".");
    cb(null, `${fileName[0]}-${Date.now()}.${fileName[1]}`);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.post(
  "/api/planets/:id/image",
  authorize,
  upload.single("image"),
  createImage
);

app.post("/api/users/login", login);
app.post("/api/users/signup", signup);
app.post("/api/users/logout", authorize, logout);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server listening on port ${process.env.PORT}. Link: http://localhost:${process.env.PORT}`
  );
});
