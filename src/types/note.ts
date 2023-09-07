import { Document } from "mongoose";
import { IUser } from "./user";

export interface INote extends Document {
  title: string;
  description: string;
  category: string;
  creator: string;
}
