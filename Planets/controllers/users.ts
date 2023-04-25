import { Request, Response } from "express";
import pgp from "../db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await pgp.oneOrNone("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (user && user.password === password) {
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.SECRET as string, {
      expiresIn: "1d",
    });

    await pgp.none("UPDATE users SET token = $1 WHERE id = $2", [
      token,
      user.id,
    ]);

    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

export { login };
