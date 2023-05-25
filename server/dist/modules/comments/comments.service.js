"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Comment_1 = require("./Comment");
const typeorm_1 = require("typeorm");
const consts_1 = require("../../consts");
class CommentService {
    async findAll({ page, limit, sortField, isSortAscending }) {
        let comments = await Comment_1.Comment.find({
            where: { parent: (0, typeorm_1.IsNull)() },
            relations: [
                'parent',
                'user',
                `replies${'.replies'.repeat(consts_1.REPLIES_DEEPNESS_DISPLAYED - 1)}`
            ],
            order: { [sortField]: isSortAscending ? 'ASC' : 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });
        const totalComments = await Comment_1.Comment.count({ where: { parent: (0, typeorm_1.IsNull)() } });
        if (!comments)
            comments = [];
        const hasNextPage = totalComments > page * limit;
        return { totalComments, comments, page, hasNextPage };
    }
    async create(comment, user) {
        comment.user = user;
        console.log(comment);
        const toBeSaved = await Comment_1.Comment.save(comment);
        return toBeSaved;
    }
}
const commentService = new CommentService();
exports.default = commentService;
//# sourceMappingURL=comments.service.js.map