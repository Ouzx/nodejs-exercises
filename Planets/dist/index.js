"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// import morgan
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
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
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT}. Link: http://localhost:${process.env.PORT}`);
});
