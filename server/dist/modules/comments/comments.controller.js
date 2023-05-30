"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const comments_service_1 = __importDefault(require("./comments.service"));
const redis_1 = __importDefault(require("../../config/redis"));
const scanAndDelete_1 = require("../../utils/redis/scanAndDelete");
class CommentController {
    constructor() { }
    async getAllComments(req, res, next) {
        const commentReq = req;
        let { page, limit, sortField, isSortAscending } = commentReq.query;
        const allowedSortFields = [
            'user.name',
            'user.email',
            'comment.createdAt',
        ];
        const pageInt = page ? parseInt(page) : 1;
        const limitInt = limit ? parseInt(limit) : 100000;
        sortField = allowedSortFields.includes(sortField) ? sortField : 'comment.createdAt';
        const isSortAscendingBool = isSortAscending === 'true';
        const cacheKey = `comments:page=${pageInt}` +
            `&limit=${limitInt}` +
            `&isSortAscending=${isSortAscendingBool}` +
            `&${sortField}`;
        const cachedComments = await redis_1.default.get(cacheKey);
        if (cachedComments) {
            return JSON.parse(cachedComments);
        }
        const comments = await comments_service_1.default.findAll({
            page: pageInt,
            limit: limitInt,
            sortField,
            isSortAscending: isSortAscendingBool,
        });
        await redis_1.default.setEx(cacheKey, 3600, JSON.stringify(comments));
        return comments;
    }
    async createComment(req) {
        var _a;
        const { parentId, text } = req.body;
        const newComment = await comments_service_1.default.create({
            text,
            parent: parentId ? { id: parentId } : undefined
        }, req.user);
        (_a = newComment.user) === null || _a === void 0 ? true : delete _a.password;
        newComment.replies = [];
        if (!req.user.comments)
            req.user.comments = [];
        (0, scanAndDelete_1.scanAndDelete)('comments:*');
        newComment.user = {
            avatarUrl: req.user.avatarUrl,
            name: req.user.name,
            id: req.user.id,
            email: req.user.email
        };
        req.user.comments.push(newComment);
        await redis_1.default.setEx(`user:${req.user.id}`, 3600, JSON.stringify(req.user));
        const message = JSON.stringify({
            event: 'newComment',
            data: newComment,
        });
        const wsClients = req.app.get('wsClients');
        wsClients.forEach((client) => {
            console.log('sending socket message...');
            client.send(message);
        });
        return newComment;
    }
}
exports.CommentController = CommentController;
const commentController = new CommentController();
exports.default = commentController;
//# sourceMappingURL=comments.controller.js.map