import { Response, Request } from 'express';
export declare class CommentController {
    constructor();
    getAllComments(req: Request): Promise<any>;
    createComment(req: Request<{
        id: string;
    }, any, {
        parentId: string;
        text: string;
    }>, res: Response): Promise<import("./Comment").Comment | "Wrong file type!" | "Text file too large!">;
}
declare const commentController: CommentController;
export default commentController;
