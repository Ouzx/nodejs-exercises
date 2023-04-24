"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
// import joi
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
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
    }
    else {
        res.status(404).json({ msg: "Planet not found" });
    }
});
app.post("/api/planets", (req, res) => {
    const { planet } = req.body;
    const { error } = planetsSchema.validate(planet);
    if (error) {
        res.status(400).json({ msg: error.details[0].message });
    }
    else {
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
    }
    else {
        const planetIndex = planets.findIndex((planet) => planet.id === Number(id));
        if (planetIndex !== -1) {
            planets[planetIndex] = planet;
            res.status(200).json({ msg: "Planet updated" });
        }
        else {
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
    }
    else {
        res.status(404).json({ msg: "Planet not found" });
    }
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT}. Link: http://localhost:${process.env.PORT}`);
});
