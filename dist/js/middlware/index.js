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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../models/user"));
const employeeAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log(process.env.APP_SECRET);
    if (!authHeader)
        return res.sendStatus(403);
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.APP_SECRET, (err, decoded) => {
        console.log("verifying");
        if (err)
            return res.sendStatus(403); //invalid token
        console.log(decoded); //for correct token
        next();
    });
};
/**
 * @DESC Check Role Middleware
 */
const checkRole = (roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name } = req.body;
    //retrieve employee info from DB
    const user = yield user_1.default.findOne({ name });
    !roles.includes(user.role)
        ? res.status(401).json("Sorry you do not have access to this route")
        : next();
});
