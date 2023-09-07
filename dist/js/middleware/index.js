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
exports.checkRole = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.sendStatus(403);
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.APP_SECRET, (err, decoded) => {
        if (err)
            return res.sendStatus(403);
        req.body.email = decoded.email;
        next();
    });
};
exports.auth = auth;
/**
 * @DESC Check Role Middleware
 */
const checkRole = (roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    //retrieve user info from DB
    const user = (yield user_1.default.findOne({ email }));
    !roles.includes(user.role)
        ? res.status(401).json("Sorry you do not have access to this route.")
        : next();
});
exports.checkRole = checkRole;
