import { Comment } from "../comments/Comment";

export interface IUser {
  id?: number;
  email: string;
  password: string;
  comments?: Comment[];
  avatarUrl?: string
}

export interface IJwtAuthPayload {
  userId: string
}

export interface ISignupFields {
  name: string,
  email: string,
}