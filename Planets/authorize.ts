import { Request, Response } from "express";
import passport from "passport";

const authorize = (req: Request, res: Response, next: any) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: unknown) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};

export { authorize };
