"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImage = exports.deleteById = exports.updateById = exports.create = exports.getOneById = exports.getAll = void 0;
// import joi
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../db"));
const planetsSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
});
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planets = yield db_1.default.manyOrNone("SELECT * FROM planets");
    res.status(200).json(planets);
});
exports.getAll = getAll;
const getOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const planet = yield db_1.default.oneOrNone("SELECT * FROM planets WHERE id = $1", [
        id,
    ]);
    if (planet) {
        res.status(200).json(planet);
    }
    else {
        res.status(404).json({ msg: "Planet not found" });
    }
});
exports.getOneById = getOneById;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { planet } = req.body;
    const { error } = planetsSchema.validate(planet);
    if (error) {
        res.status(400).json({ msg: error.details[0].message });
    }
    else {
        const newPlanet = yield db_1.default.one("INSERT INTO planets (name) VALUES ($1) RETURNING *", [planet.name]);
        res.status(201).json(newPlanet);
    }
});
exports.create = create;
const updateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { planet } = req.body;
    const { error } = planetsSchema.validate(planet);
    if (error) {
        res.status(400).json({ msg: error.details[0].message });
    }
    else {
        const updatedPlanet = yield db_1.default.oneOrNone("UPDATE planets SET name = $1 WHERE id = $2 RETURNING *", [planet.name, id]);
        if (updatedPlanet) {
            res.status(200).json(updatedPlanet);
        }
        else {
            res.status(404).json({ msg: "Planet not found" });
        }
    }
});
exports.updateById = updateById;
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedPlanet = yield db_1.default.oneOrNone("DELETE FROM planets WHERE id = $1 RETURNING *", [id]);
    if (deletedPlanet) {
        res.status(200).json(deletedPlanet);
    }
    else {
        res.status(404).json({ msg: "Planet not found" });
    }
});
exports.deleteById = deleteById;
const createImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const planet = yield db_1.default.oneOrNone("SELECT * FROM planets WHERE id = $1", [
        id,
    ]);
    if (planet && req.file) {
        const updatedPlanet = yield db_1.default.oneOrNone("UPDATE planets SET imgPath = $1 WHERE id = $2 RETURNING *", [req.file.path, id]);
        res.status(200).json(updatedPlanet);
    }
});
exports.createImage = createImage;
