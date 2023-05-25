import { IComment } from './comments.type';
import { Comment } from './Comment';
import { User } from '../users/User';
declare class CommentService {
    findAll({ page, limit, sortField, isSortAscending }: {
        page: number;
        limit: number;
        sortField: string;
        isSortAscending: boolean;
    }): Promise<{
        totalComments: number;
        comments: Comment[];
        page: number;
        hasNextPage: boolean;
    }>;
    create(comment: IComment, user: User): Promise<Comment>;
}
declare const commentService: CommentService;
export default commentService;
