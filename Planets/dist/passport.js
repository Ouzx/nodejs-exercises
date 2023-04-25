"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config();
passport_1.default.use(new passport_jwt_1.default.Strategy({
    jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
}, (jwtPayload, done) => {
    const user = db_1.default.oneOrNone("SELECT * FROM users WHERE id = $1", [
        jwtPayload.id,
    ]);
    console.log(user);
    try {
        return user ? done(null, user) : done(new Error("User not found"));
    }
    catch (err) {
        console.log(err);
    }
}));
