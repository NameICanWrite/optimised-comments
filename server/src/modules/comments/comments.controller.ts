import { IComment } from './comments.type';
import e, { Response, Request, NextFunction } from 'express';
import commentService from './comments.service';
import TryCatch from '../../utils/try-catch.decorator';
import Joi from 'joi';
import { Comment } from './Comment';
import { User } from '../users/User';


@TryCatch
export class CommentController {
  constructor() {}

  async getAllComments(
      req: Request & {
        user: User, 
        query: {
          page: string,
          limit: string,
          sortField: string,
          isSortAscending: string,
        }
      }, 
      res: Response, 
      next: NextFunction
  ) {
    let {page, limit, sortField, isSortAscending} = req.query
    const allowedSortFields = [
      'user.name',
      'user.email',
      'createdAt',
    ]
    return await commentService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 100000,
      sortField: allowedSortFields.includes(sortField) ? sortField : 'createdAt',
      isSortAscending: isSortAscending === 'true',
    })
  }

  async createComment(req: Request<{id: string}, any, IComment> & {user: User, res: Response}) {
    const {parentId, text} = req.body
    const comment = await commentService.create({text, parent: parentId ? {id: parentId} : undefined}, req.user as User)
    return comment
  }

}

const commentController = new CommentController();
export default commentController;



