"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const consts_1 = require("../../consts");
const validationSchemas = {
    [consts_1.entityTypes.COMMENTS]: joi_1.default.object({
        captchaText: joi_1.default.string().trim().required(),
        captchaId: joi_1.default.number().required(),
        text: joi_1.default.string().trim().required(),
        parentId: joi_1.default.number(),
    }),
    signup: joi_1.default.object({
        email: joi_1.default.string().trim().email().required(),
        password: joi_1.default.string().required(),
        name: joi_1.default.string().required()
    }).options({ allowUnknown: true }),
    login: joi_1.default.object({
        email: joi_1.default.string().trim().email().required(),
        password: joi_1.default.string().required()
    }),
    withEmail: joi_1.default.object({
        email: joi_1.default.string().trim().email().required()
    }),
    resetPassword: joi_1.default.object({
        code: joi_1.default.string().trim().length(4).required(),
        email: joi_1.default.string().trim().email().required(),
        newPassword: joi_1.default.string().required()
    }).options({ allowUnknown: true })
};
exports.default = validationSchemas;
//# sourceMappingURL=validation.schemas.js.map