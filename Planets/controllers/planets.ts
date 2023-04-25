import { Request, Response } from "express";
// import joi
import Joi from "joi";

import pgp from "../db";

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

const createImage = async (req: Request, res: Response) => {
  const { id } = req.params;

  const planet = await pgp.oneOrNone("SELECT * FROM planets WHERE id = $1", [
    id,
  ]);

  if (planet && req.file) {
    const updatedPlanet = await pgp.oneOrNone(
      "UPDATE planets SET imgPath = $1 WHERE id = $2 RETURNING *",
      [req.file.path, id]
    );
    res.status(200).json(updatedPlanet);
  }
};

export { getAll, getOneById, create, updateById, deleteById, createImage };
