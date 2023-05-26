"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_controller_1 = __importDefault(require("./comments.controller"));
const generic_validator_1 = __importDefault(require("../../utils/validation/generic.validator"));
const Comment_1 = require("./Comment");
const auth_middleware_1 = require("../users/auth.middleware");
const captcha_middleware_1 = require("../captcha/captcha.middleware");
const commentsRouter = (0, express_1.Router)();
commentsRouter.get('/', comments_controller_1.default.getAllComments);
commentsRouter.post('/', generic_validator_1.default.isBodyValidEntity(Comment_1.Comment), captcha_middleware_1.isCaptchaSolved, auth_middleware_1.authAndGetUser, comments_controller_1.default.createComment);
exports.default = commentsRouter;
//# sourceMappingURL=comments.route.js.map