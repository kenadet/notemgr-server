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
exports.updateUser = exports.getUsers = exports.userLogin = exports.userSignup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../models/user"));
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Get employee from database with same email if any
        const validateEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
            let user = yield user_1.default.findOne({ email });
            return user ? false : true;
        });
        const body = req.body;
        // validate the email
        let EmailNotRegistered = yield validateEmail(body.email);
        if (!EmailNotRegistered) {
            return res.status(400).json({
                message: `Email is already registered.`,
            });
        }
        // Hash password using bcrypt
        const password = yield bcrypt_1.default.hash(body.password, 12);
        // create a new user
        const user = new user_1.default({
            email: body.email,
            password: password,
            firstname: body.firstname,
            lastname: body.lastname,
        });
        const newUser = yield user.save();
        const returnedUser = new user_1.default({
            email: newUser.email,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
        });
        return res.status(201).json({
            message: "Registration successful",
            user: returnedUser,
        });
    }
    catch (error) {
        return res.status(201).json({
            message: `Registration failed: ${error.message}`,
        });
    }
});
exports.userSignup = userSignup;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    // First Check if the user exist in the database
    const user = yield user_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "Invalid username or password.",
            success: false,
        });
    }
    // That means the employee is existing and trying to signin fro the right portal
    // Now check if the password match
    let isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (isMatch) {
        // if the password match Sign a the token and issue it to the employee
        let token = jsonwebtoken_1.default.sign({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        }, process.env.APP_SECRET, { expiresIn: "1 days" });
        let result = {
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            expiresIn: "1 hour",
            token: token,
        };
        return res.status(200).json(Object.assign(Object.assign({}, result), { message: "You are now logged in." }));
    }
    else {
        return res.status(403).json({
            message: "Invalid username or password.",
        });
    }
});
exports.userLogin = userLogin;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offset = Number(req.query.page) - 1;
        const limit = Number(req.query.limit);
        const users = yield user_1.default.find()
            .select(["-password"])
            .skip(offset)
            .limit(limit);
        const count = yield user_1.default.count();
        // return response with posts, total pages, and current page
        res.status(200).json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: offset + 1,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { email }, body, } = req;
        body.password = yield bcrypt_1.default.hash(body.password, 12);
        const updateUser = yield user_1.default.findOneAndUpdate({ email: email }, body, { new: true });
        res.status(200).json({
            message: "User updated",
            note: updateUser,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.updateUser = updateUser;
