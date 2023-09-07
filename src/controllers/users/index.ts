import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser, IUserCredential } from "../../types/user";
import User from "../../models/user";

const userSignup = async (req: Request, res: Response): Promise<any> => {
  try {
    //Get employee from database with same email if any
    const validateEmail = async (email: string) => {
      let user = await User.findOne({ email });
      return user ? false : true;
    };

    const body = req.body as Pick<
      IUser,
      "email" | "password" | "firstname" | "lastname"
    >;

    // validate the email
    let EmailNotRegistered = await validateEmail(body.email);
    if (!EmailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
      });
    }
    // Hash password using bcrypt
    const password = await bcrypt.hash(body.password, 12);
    // create a new user
    const user: IUser = new User({
      email: body.email,
      password: password,
      firstname: body.firstname,
      lastname: body.lastname,
    });

    const newUser = await user.save();

    const returnedUser: IUser = new User({
      email: newUser.email,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
    });

    return res.status(201).json({
      message: "Registration successful",
      user: returnedUser,
    });
  } catch (error: any) {
    return res.status(201).json({
      message: `Registration failed: ${error.message}`,
    });
  }
};

const userLogin = async (req: Request, res: Response): Promise<any> => {
  let { email, password } = req.body as Pick<
    IUserCredential,
    "email" | "password"
  >;

  // First Check if the user exist in the database
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "Invalid username or password.",
      success: false,
    });
  }

  // That means the employee is existing and trying to signin fro the right portal
  // Now check if the password match
  let isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    // if the password match Sign a the token and issue it to the employee
    let token = jwt.sign(
      {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      process.env.APP_SECRET as string,
      { expiresIn: "1 days" }
    );

    let result = {
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      expiresIn: "1 hour",
      token: token,
    };

    return res.status(200).json({
      ...result,
      message: "You are now logged in.",
    });
  } else {
    return res.status(403).json({
      message: "Invalid username or password.",
    });
  }
};

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const offset = Number(req.query.page) - 1;
    const limit = Number(req.query.limit);

    const users: IUser[] = await User.find()
      .select(["-password"])
      .skip(offset)
      .limit(limit);

    const count = await User.count();

    // return response with posts, total pages, and current page
    res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: offset + 1,
    });
  } catch (error) {
    throw error;
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { email },
      body,
    } = req;

    body.password = await bcrypt.hash(body.password, 12);

    const updateUser: IUser | null = await User.findOneAndUpdate(
      { email: email },
      body,
      { new: true }
    );

    res.status(200).json({
      message: "User updated",
      note: updateUser,
    });
  } catch (error) {
    throw error;
  }
};

export { userSignup, userLogin, getUsers, updateUser };
