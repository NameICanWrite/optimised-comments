import { NextFunction, Router } from 'express';

import commentController from './comments.controller';
import validator from '../../utils/validation/generic.validator';
import { Comment } from './Comment';
import { authAndGetUser } from '../users/auth.middleware';
import { isCaptchaSolved } from '../captcha/captcha.middleware';


const commentsRouter: Router = Router();

commentsRouter.get('/',
commentController.getAllComments
);
commentsRouter.post('/', 
  validator.isBodyValidEntity(Comment),
  isCaptchaSolved,
  authAndGetUser,
  commentController.createComment
)

export default commentsRouter;
