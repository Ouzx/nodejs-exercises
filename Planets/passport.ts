import dotenv from "dotenv";
import passport from "passport";
import passportJWT from "passport-jwt";
import pgp from "./db";

dotenv.config();

passport.use(
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    (jwtPayload, done) => {
      const user = pgp.oneOrNone("SELECT * FROM users WHERE id = $1", [
        jwtPayload.id,
      ]);

      console.log(user);

      try {
        return user ? done(null, user) : done(new Error("User not found"));
      } catch (err) {
        console.log(err);
      }
    }
  )
);
