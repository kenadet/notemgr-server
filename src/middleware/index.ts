import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { IUser } from "../types/user";

interface JwtPayLoad {
  email: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.sendStatus(403);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.APP_SECRET as string, (err, decoded) => {
    if (err) return res.sendStatus(403);

    req.body.email = (decoded as JwtPayLoad).email;

    next();
  });
};

/**
 * @DESC Check Role Middleware
 */
const checkRole =
  (roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    //retrieve user info from DB
    const user: IUser = (await User.findOne({ email })) as IUser;

    !roles.includes(user.role)
      ? res.status(401).json("Sorry you do not have access to this route.")
      : next();
  };

export { auth, checkRole };
