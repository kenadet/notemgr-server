import { Router } from "express";
import {
  getUsers,
  updateUser,
  userLogin,
  userSignup,
} from "../../controllers/users";
import { auth, checkRole } from "../../middleware";

const userRouter: Router = Router();

userRouter.post("/signup", userSignup);
userRouter.post("/login", userLogin);
userRouter.get("/", auth, checkRole(["Admin"]), getUsers);
userRouter.put("/:email", auth, updateUser);

export default userRouter;
