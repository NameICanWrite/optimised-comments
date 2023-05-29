"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const comments_service_1 = __importDefault(require("./comments.service"));
const try_catch_decorator_1 = __importDefault(require("../../utils/try-catch.decorator"));
const redis_1 = __importDefault(require("../../config/redis"));
const scanAndDelete_1 = require("../../utils/redis/scanAndDelete");
let CommentController = class CommentController {
    constructor() { }
    async getAllComments(req, res, next) {
        let { page, limit, sortField, isSortAscending } = req.query;
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
        const newComment = await comments_service_1.default.create({ text, parent: parentId ? { id: parentId } : undefined }, req.user);
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
};
CommentController = __decorate([
    try_catch_decorator_1.default,
    __metadata("design:paramtypes", [])
], CommentController);
exports.CommentController = CommentController;
const commentController = new CommentController();
exports.default = commentController;
//# sourceMappingURL=comments.controller.js.map