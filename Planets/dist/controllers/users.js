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
exports.login = void 0;
const db_1 = __importDefault(require("../db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.default.oneOrNone("SELECT * FROM users WHERE username = $1", [
        username,
    ]);
    if (user && user.password === password) {
        const payload = {
            id: user.id,
            username: user.username,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET, {
            expiresIn: "1d",
        });
        yield db_1.default.none("UPDATE users SET token = $1 WHERE id = $2", [
            token,
            user.id,
        ]);
        return res.status(200).json({ token });
    }
    else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});
exports.login = login;
