import dotenv from "dotenv";
import express from "express";
// import morgan
import morgan from "morgan";

dotenv.config();

const app = express();

app.use(morgan("dev"));

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/planets", (req, res) => {
  const { planet } = req.body;
  planets.push(planet);
  res.send("Planet added");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server listening on port ${process.env.PORT}. Link: http://localhost:${process.env.PORT}`
  );
});
