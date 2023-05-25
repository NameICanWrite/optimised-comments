import { BaseEntity } from 'typeorm';
import { Comment } from '../comments/Comment';
export declare class User extends BaseEntity {
    id: string;
    email: string;
    name: string;
    avatar: string;
    password: string;
    isActive: boolean;
    passwordResetCode: string;
    passwordResetCodeExpiresAt: string;
    comments: Array<Comment>;
}
