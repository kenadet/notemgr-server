import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: string;
}

export interface IUserCredential extends Document {
  email: string;
  password: string;
}
