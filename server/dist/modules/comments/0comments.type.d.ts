import { User } from "../users/User";
import { IUser } from "../users/user.type";
export interface IComment {
    id?: number;
    text?: string;
    userId?: number;
    parent?: IComment;
    replies?: IComment[];
    user?: IUser | User;
}
