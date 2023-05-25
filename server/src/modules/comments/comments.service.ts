import { IUser } from '../users/user.type';
import { IComment } from './comments.type';
import { Comment } from './Comment';
import { DeepPartial, ILike, In, IsNull, Like, Not, getConnection } from 'typeorm';
import { User } from '../users/User';
import { REPLIES_DEEPNESS_DISPLAYED, entityTypes } from '../../consts';



class CommentService {
  async findAll({ page, limit, sortField, isSortAscending }: {
    page: number, limit: number, sortField: string, isSortAscending: boolean
  }) {

    // let comments = await Comment.find({
    //   where: {parent: IsNull()},
    //   relations: [
    //     'parent', 
    //     'user', 
    //     `replies${'.replies'.repeat(REPLIES_DEEPNESS_DISPLAYED - 1)}`
    //     // 'replies'
    //   ],
    //   relationLoadStrategy: "join",
    //   select: ['createdAt', 'text', 'parent', 'replies', 'id'],
    //   order: {[sortField]: isSortAscending ? 'ASC' : 'DESC' },
    //   skip: (page - 1) * limit,
    //   take: limit
    // })

    const queryBuilder = getConnection().createQueryBuilder();
    queryBuilder
      .select([
        'comment.id',
        'comment.createdAt',
        'comment.text',
        'user.id',
        'user.name',
        'user.email',
        'user.avatar',
      ])
      .from(Comment, 'comment')
      .andWhere('comment.parent IS NULL')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoin('comment.user', 'user')
      .orderBy(sortField, isSortAscending ? 'ASC' : 'DESC')

    for (let i = 1; i <= REPLIES_DEEPNESS_DISPLAYED; i++) {
      const alias = `replies${i}`;
      const prevAlias = i === 1 ? 'comment' : `replies${i - 1}`;
      queryBuilder
        .leftJoinAndSelect(`${prevAlias}.replies`, alias)
        .leftJoin(`${alias}.user`, `user_${alias}`)
        .addSelect([
          `user_${alias}.id`,
          `user_${alias}.name`,
          `user_${alias}.email`,
          `user_${alias}.avatar`,
        ])
    }
    const comments = await queryBuilder.getMany();
    const totalComments = await Comment.count({ where: { parent: IsNull() } })

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
