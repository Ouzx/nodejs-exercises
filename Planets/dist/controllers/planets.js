"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.updateById = exports.create = exports.getOneById = exports.getAll = void 0;
// import joi
const joi_1 = __importDefault(require("joi"));
const planetsSchema = joi_1.default.object({
    id: joi_1.default.number().required(),
    name: joi_1.default.string().required(),
});
let planets = [
    {
        id: 1,
        name: "Earth",
    },
    {
        id: 2,
        name: "Mars",
    },
];
const getAll = (req, res) => {
    res.status(200).json(planets);
};
exports.getAll = getAll;
const getOneById = (req, res) => {
    const { id } = req.params;
    const planet = planets.find((planet) => planet.id === Number(id));
    if (planet) {
        res.status(200).json(planet);
    }
    else {
        res.status(404).json({ msg: "Planet not found" });
    }
};
exports.getOneById = getOneById;
const create = (req, res) => {
    const { planet } = req.body;
    const { error } = planetsSchema.validate(planet);
    if (error) {
        res.status(400).json({ msg: error.details[0].message });
    }
    else {
        planets = [...planets, planet];
        res.status(201).json({ msg: "Planet added" });
    }
};
exports.create = create;
const updateById = (req, res) => {
    const { id } = req.params;
    const { planet } = req.body;
    const { error } = planetsSchema.validate(planet);
    if (error) {
        res.status(400).json({ msg: error.details[0].message });
    }
    else {
        const planetIndex = planets.map((planet) => planet.id).indexOf(Number(id));
        if (planetIndex !== -1) {
            planets[planetIndex] = planet;
            res.status(200).json({ msg: "Planet updated" });
        }
        else {
            res.status(404).json({ msg: "Planet not found" });
        }
    }
};
exports.updateById = updateById;
const deleteById = (req, res) => {
    const { id } = req.params;
    planets = planets.filter((planet) => planet.id !== Number(id));
    res.status(200).json({ msg: "Planet deleted" });
};
exports.deleteById = deleteById;
