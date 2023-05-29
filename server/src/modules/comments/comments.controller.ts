import { IComment } from './comments.type';
import e, { Response, Request, NextFunction } from 'express';
import commentService from './comments.service';
import TryCatch from '../../utils/try-catch.decorator';
import Joi from 'joi';
import { Comment } from './Comment';
import { User } from '../users/User';
import { Set } from 'typescript';
import WebSocket from 'ws';
import redisClient from '../../config/redis';
import { scanAndDelete } from '../../utils/redis/scanAndDelete';


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
      'comment.createdAt',
    ]
    const pageInt = page ? parseInt(page) : 1
    const limitInt = limit ? parseInt(limit) : 100000
    sortField =  allowedSortFields.includes(sortField) ? sortField : 'comment.createdAt'
    const isSortAscendingBool = isSortAscending === 'true'

    const cacheKey = `comments:page=${pageInt}` + 
    `&limit=${limitInt}` + 
    `&isSortAscending=${isSortAscendingBool}` + 
    `&${sortField}`

    const cachedComments = await redisClient.get(cacheKey)

    if (cachedComments) {
      return JSON.parse(cachedComments)
    }

    const comments = await commentService.findAll({
      page: pageInt,
      limit: limitInt,
      sortField,
      isSortAscending: isSortAscendingBool,
    })

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(comments))

    return comments
  }

  async createComment(req: Request<{id: string}, any, IComment> & {user: User}) {
    const {parentId, text} = req.body
    const newComment = await commentService.create({text, parent: parentId ? {id: parentId} : undefined}, req.user as User)
    delete newComment.user
    delete newComment.parent
    newComment.replies = []
    req.user.comments.push(newComment)
    console.log(req.user);
    await redisClient.setEx(`user:${req.user.id}`, 3600, JSON.stringify(req.user))

    scanAndDelete('comments:*')
    
    
    newComment.user = {
      avatarUrl: req.user.avatarUrl,
      name: req.user.name,
      id: req.user.id, 
      email: req.user.email
    }
    
    // Emit a WebSocket event to notify clients about the new comment
    const message = JSON.stringify({
      event: 'newComment',
      data: newComment,
    });

    const wsClients = req.app.get('wsClients')

    wsClients.forEach((client: WebSocket) => {
      console.log('sending socket message...');
      client.send(message);
    });
    return newComment
  }

}

const commentController = new CommentController();
export default commentController;



