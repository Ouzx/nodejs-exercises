import { Request, Response } from "express";
// import joi
import Joi from "joi";
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

const getAll = (req: Request, res: Response) => {
  res.status(200).json(planets);
};

const getOneById = (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = planets.find((planet) => planet.id === Number(id));
  if (planet) {
    res.status(200).json(planet);
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
};

const create = (req: Request, res: Response) => {
  const { planet } = req.body;
  const { error } = planetsSchema.validate(planet);
  if (error) {
    res.status(400).json({ msg: error.details[0].message });
  } else {
    planets = [...planets, planet];
    res.status(201).json({ msg: "Planet added" });
  }
};

const updateById = (req: Request, res: Response) => {
  const { id } = req.params;
  const { planet } = req.body;
  const { error } = planetsSchema.validate(planet);
  if (error) {
    res.status(400).json({ msg: error.details[0].message });
  } else {
    const planetIndex = planets.map((planet) => planet.id).indexOf(Number(id));
    if (planetIndex !== -1) {
      planets[planetIndex] = planet;
      res.status(200).json({ msg: "Planet updated" });
    } else {
      res.status(404).json({ msg: "Planet not found" });
    }
  }
};

const deleteById = (req: Request, res: Response) => {
  const { id } = req.params;

  planets = planets.filter((planet) => planet.id !== Number(id));
  res.status(200).json({ msg: "Planet deleted" });
};

export { getAll, getOneById, create, updateById, deleteById };
