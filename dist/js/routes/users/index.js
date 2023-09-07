"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../../controllers/users");
const middleware_1 = require("../../middleware");
const userRouter = (0, express_1.Router)();
userRouter.post("/signup", users_1.userSignup);
userRouter.post("/login", users_1.userLogin);
userRouter.get("/", middleware_1.auth, (0, middleware_1.checkRole)(["Admin"]), users_1.getUsers);
userRouter.put("/:email", middleware_1.auth, users_1.updateUser);
exports.default = userRouter;
