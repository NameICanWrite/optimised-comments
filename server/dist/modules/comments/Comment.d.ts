import { BaseEntity } from 'typeorm';
import { User } from '../users/User';
export declare class Comment extends BaseEntity {
    id: number;
    createdAt: string;
    text: string;
    parent: Comment;
    replies: Comment[];
    user: User;
}
