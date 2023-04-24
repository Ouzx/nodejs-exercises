"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT}. Link: http://localhost:${process.env.PORT}`);
});
