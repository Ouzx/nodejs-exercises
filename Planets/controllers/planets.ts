import { Request, Response } from "express";
// import joi
import Joi from "joi";

import pgPromise from "pg-promise";

const pgp = pgPromise()("postgres://admin:admin@localhost:5432/planets");

const setupDb = async () => {
  await pgp.none(
    `
    CREATE TABLE IF NOT EXISTS planets (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
    );`
  );
};

setupDb();

const planetsSchema = Joi.object({
  name: Joi.string().required(),
});

const getAll = async (req: Request, res: Response) => {
  const planets = await pgp.manyOrNone("SELECT * FROM planets");

  res.status(200).json(planets);
};

const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const planet = await pgp.oneOrNone("SELECT * FROM planets WHERE id = $1", [
    id,
  ]);

  if (planet) {
    res.status(200).json(planet);
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
};

const create = async (req: Request, res: Response) => {
  const { planet } = req.body;
  const { error } = planetsSchema.validate(planet);
  if (error) {
    res.status(400).json({ msg: error.details[0].message });
  } else {
    const newPlanet = await pgp.one(
      "INSERT INTO planets (name) VALUES ($1) RETURNING *",
      [planet.name]
    );
    res.status(201).json(newPlanet);
  }
};

const updateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { planet } = req.body;
  const { error } = planetsSchema.validate(planet);
  if (error) {
    res.status(400).json({ msg: error.details[0].message });
  } else {
    const updatedPlanet = await pgp.oneOrNone(
      "UPDATE planets SET name = $1 WHERE id = $2 RETURNING *",
      [planet.name, id]
    );
    if (updatedPlanet) {
      res.status(200).json(updatedPlanet);
    } else {
      res.status(404).json({ msg: "Planet not found" });
    }
  }
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedPlanet = await pgp.oneOrNone(
    "DELETE FROM planets WHERE id = $1 RETURNING *",
    [id]
  );
  if (deletedPlanet) {
    res.status(200).json(deletedPlanet);
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
};

export { getAll, getOneById, create, updateById, deleteById };
