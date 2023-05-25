import { Router } from 'express';

import commentController from './comments.controller';
import validator from '../../utils/validation/generic.validator';
import { Comment } from './Comment';
import { authAndGetUser } from '../users/auth.middleware';

const commentsRouter: Router = Router();

commentsRouter.get('/',
commentController.getAllComments
);
commentsRouter.post('/', 
  authAndGetUser,
  validator.isBodyValidEntity(Comment),
  commentController.createComment
)

// commentsRouter.put('/:id', 
//   authAndGetUser,
//   validator.isBodyValidEntity(Comment),
//   validator.isEntityExistsById(Comment),
//   isCommentOwner,
//   commentController.editComment.bind(commentController)
// )
// commentsRouter.get('/one/:id', 
//   optionalAuthAndGetUser,
//   validator.isEntityExistsById(Comment),
//   commentController.getOneComment
// )
// commentsRouter.delete('/:id',
//   authAndGetUser,
//   validator.isEntityExistsById(Comment),
//   isCommentOwner, 
//   commentController.deleteComment
// )

export default commentsRouter;
