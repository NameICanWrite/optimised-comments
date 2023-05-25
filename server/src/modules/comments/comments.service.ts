import { IUser } from '../users/user.type';
import { IComment } from './comments.type';
import { Comment } from './Comment';
import { DeepPartial, ILike, In, IsNull, Like, Not } from 'typeorm';
import { User } from '../users/User';
import { REPLIES_DEEPNESS_DISPLAYED } from '../../consts';



class CommentService {
  async findAll({page, limit, sortField, isSortAscending} :{
    page: number, limit: number, sortField: string, isSortAscending: boolean
  }) {

    let comments = await Comment.find({
      where: {parent: IsNull()}, 
      relations: [
        'parent', 
        'user', 
        `replies${'.replies'.repeat(REPLIES_DEEPNESS_DISPLAYED - 1)}`
      ],
      order: {[sortField]: isSortAscending ? 'ASC' : 'DESC' },
      skip: (page - 1) * limit,
      take: limit
    })
    const totalComments = await Comment.count({where: { parent: IsNull() }})

    if (!comments) comments = []
    const hasNextPage = totalComments > page * limit
    return { totalComments, comments, page, hasNextPage }
  }

  async create(comment: IComment, user: User) {
    comment.user = user
    console.log(comment);
    const toBeSaved = await Comment.save(comment as DeepPartial<Comment>)
    return toBeSaved
  }
}


const commentService = new CommentService()
export default commentService
