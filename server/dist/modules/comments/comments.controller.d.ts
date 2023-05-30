import { Response, Request, NextFunction } from 'express';
import { Comment } from './Comment';
import { User } from '../users/User';
export declare class CommentController {
    constructor();
    getAllComments(req: Request, res: Response, next: NextFunction): Promise<any>;
    createComment(req: Request<{
        id: string;
    }, any, {
        parentId: number;
        text: string;
    }> & {
        user: User;
    }): Promise<Comment>;
}
declare const commentController: CommentController;
export default commentController;
