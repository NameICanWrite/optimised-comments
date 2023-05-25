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
let CommentController = class CommentController {
    constructor() { }
    async getAllComments(req, res, next) {
        let { page, limit, sortField, isSortAscending } = req.query;
        const allowedSortFields = [
            'user.name',
            'user.email',
            'comment.createdAt',
        ];
        return await comments_service_1.default.findAll({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 100000,
            sortField: allowedSortFields.includes(sortField) ? sortField : 'comment.createdAt',
            isSortAscending: isSortAscending === 'true',
        });
    }
    async createComment(req) {
        const { parentId, text } = req.body;
        const comment = await comments_service_1.default.create({ text, parent: parentId ? { id: parentId } : undefined }, req.user);
        return comment;
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