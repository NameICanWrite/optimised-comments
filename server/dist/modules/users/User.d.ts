import { BaseEntity } from 'typeorm';
import { Comment } from '../comments/Comment';
export declare class User extends BaseEntity {
    id: number;
    email: string;
    name: string;
    avatarUrl: string;
    homepage: string;
    password: string;
    isActive: boolean;
    comments: Array<Comment>;
}
