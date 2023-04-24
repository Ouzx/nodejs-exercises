import dotenv from "dotenv";
import express, { Request, Response } from "express";
import morgan from "morgan";
// import joi
import Joi from "joi";

dotenv.config();

const app = express();
app.use(express.json());

app.use(morgan("dev"));

const planetsSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
});

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

/**
 * - Write a router with the following routes:
  - `GET /api/planets`: return all planets (JSON) with `200`
  - `GET /api/planets/:id`: return a planet (JSON) by id with `200`
  - `POST /api/planets`: create a planet, return only `201` code and a success JSON with key `msg`
    - Make sure every planet is created with `id` and `name`.
  - `PUT /api/planets/:id`: update a planet by id, return only `200` code and a success JSON with key `msg`
  - `DELETE /api/planets/:id`: delete a planet by id, return only `200` code and a success JSON with key `msg`
- Validate planet fields where appropriate.
 */

app.get("/api/planets", (req, res) => {
  res.status(200).json(planets);
});

app.get("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const planet = planets.find((planet) => planet.id === Number(id));
  if (planet) {
    res.status(200).json(planet);
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
});

app.post("/api/planets", (req: Request, res: Response) => {
  const { planet } = req.body;
  const { error } = planetsSchema.validate(planet);
  if (error) {
    res.status(400).json({ msg: error.details[0].message });
  } else {
    planets.push(planet);
    res.status(201).json({ msg: "Planet added" });
  }
});

app.put("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const { planet } = req.body;
  const { error } = planetsSchema.validate(planet);
  if (error) {
    res.status(400).json({ msg: error.details[0].message });
  } else {
    const planetIndex = planets.findIndex((planet) => planet.id === Number(id));
    if (planetIndex !== -1) {
      planets[planetIndex] = planet;
      res.status(200).json({ msg: "Planet updated" });
    } else {
      res.status(404).json({ msg: "Planet not found" });
    }
  }
});

app.delete("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const planetIndex = planets.findIndex((planet) => planet.id === Number(id));
  if (planetIndex !== -1) {
    planets.splice(planetIndex, 1);
    res.status(200).json({ msg: "Planet deleted" });
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server listening on port ${process.env.PORT}. Link: http://localhost:${process.env.PORT}`
  );
});
