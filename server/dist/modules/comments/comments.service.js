"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Comment_1 = require("./Comment");
const typeorm_1 = require("typeorm");
const consts_1 = require("../../consts");
class CommentService {
    async findAll({ page, limit, sortField, isSortAscending }) {
        const queryBuilder = (0, typeorm_1.getConnection)().createQueryBuilder();
        queryBuilder
            .select([
            'comment.id',
            'comment.createdAt',
            'comment.text',
            'user.id',
            'user.name',
            'user.email',
            'user.avatarUrl',
        ])
            .from(Comment_1.Comment, 'comment')
            .where('comment.parent IS NULL')
            .leftJoinAndSelect('comment.parent', 'parent')
            .leftJoinAndSelect('comment.user', 'user')
            .addOrderBy(sortField, isSortAscending ? 'ASC' : 'DESC');
        for (let i = 1; i <= consts_1.REPLIES_DEEPNESS_DISPLAYED; i++) {
            const alias = `replies${i}`;
            const prevAlias = i === 1 ? 'comment' : `replies${i - 1}`;
            queryBuilder
                .leftJoinAndSelect(`${prevAlias}.replies`, alias)
                .leftJoin(`${alias}.user`, `user_${alias}`)
                .addSelect([
                `user_${alias}.id`,
                `user_${alias}.name`,
                `user_${alias}.email`,
                `user_${alias}.avatarUrl`,
            ])
                .addOrderBy(`${alias}.createdAt`, 'DESC');
        }
        const skip = (page - 1) * limit;
        const comments = (await queryBuilder.getMany()).slice(skip, skip + limit);
        const totalComments = await Comment_1.Comment.count({ where: { parent: (0, typeorm_1.IsNull)() } });
        if (!comments)
            comments = [];
        const hasNextPage = totalComments > page * limit;
        return { totalComments, comments, page, hasNextPage };
    }
    async create(comment, user) {
        comment.user = user;
        const toBeSaved = await Comment_1.Comment.save(comment);
        return toBeSaved;
    }
}
const commentService = new CommentService();
exports.default = commentService;
//# sourceMappingURL=comments.service.js.map