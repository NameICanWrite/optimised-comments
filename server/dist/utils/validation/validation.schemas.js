"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const consts_1 = require("../../consts");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validTagsRegex = /<(a|code|i|strong)(\s+\w+="[^"]*")*>.*<\/\1>|^[^<>]+$/;
const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
const validationSchemas = {
    [consts_1.entityTypes.COMMENTS]: process.env.IS_CAPTCHA_ON ? joi_1.default.object({
        captchaText: joi_1.default.string().trim().required(),
        captchaId: joi_1.default.number().required(),
        text: joi_1.default.string().trim().regex(validTagsRegex, 'Invalid html tags detected').required(),
        parentId: joi_1.default.number(),
    }) : joi_1.default.object({
        text: joi_1.default.string().trim().regex(validTagsRegex).required(),
        parentId: joi_1.default.number(),
    }),
    signup: joi_1.default.object({
        email: joi_1.default.string().trim().email().required(),
        password: joi_1.default.string().min(8).regex(validPasswordRegex).required().messages({
            'string.min': 'pass too weak: minimum 8 symbols',
            'string.pattern.base': 'pass too weak: minimum of 1 character and 1 number'
        }),
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