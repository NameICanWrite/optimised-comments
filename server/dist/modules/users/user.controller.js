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
exports.userController = exports.UserController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = __importDefault(require("./user.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const consts_1 = require("../../consts");
const dotenv_1 = __importDefault(require("dotenv"));
const sharp_1 = __importDefault(require("sharp"));
const firebase_1 = require("../../utils/firebase");
const joi_1 = __importDefault(require("joi"));
const redis_1 = __importDefault(require("../../config/redis"));
const jwt_utils_1 = require("../../utils/jwt.utils");
const try_catch_decorator_1 = __importDefault(require("../../utils/try-catch.decorator"));
const email_queue_1 = require("./email.queue");
const scanAndDelete_1 = require("../../utils/redis/scanAndDelete");
dotenv_1.default.config();
let UserController = class UserController {
    constructor() { }
    async login(req, res, next) {
        const { email, password } = req.body;
        const user = await user_service_1.default.findByEmail(email);
        if (!user) {
            res.status(401);
            return 'User doesnt exist';
        }
        const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401);
            return 'Password incorrect';
        }
        if (!user.isActive) {
            res.status(401);
            return 'Visit your email and activate user (user is inactive)';
        }
        await redis_1.default.setEx(`user:${user.id}`, 3600, JSON.stringify(user));
        (0, jwt_utils_1.addJwtCookie)(res, { userId: user.id });
        return Object.assign(Object.assign({}, user), { password: undefined });
    }
    async redirectIfUserExists(req, res, next) {
        if (!req.user) {
            return res.redirect(consts_1.FRONTEND_PAGES.TOKEN_CONFIRMATION_FAILURE);
        }
        (0, jwt_utils_1.addJwtCookie)(res, { userId: req.user.id });
        return res.redirect(`${process.env.CLIENT_ROOT_URL}`);
    }
    async signUpAndSendActivationEmail(req, res, next) {
        const { email, password, name } = req.body;
        let existingUserWithEmail = await user_service_1.default.findByEmail(email);
        if (existingUserWithEmail) {
            if (existingUserWithEmail.isActive) {
                res.status(400);
                return 'User email already exists';
            }
            else {
                await user_service_1.default.delete(existingUserWithEmail.id);
            }
        }
        let existingUserWithName = await user_service_1.default.findByEmail(name);
        if (existingUserWithName) {
            if (existingUserWithName.isActive) {
                res.status(400);
                return 'User name already exists';
            }
            else {
                await user_service_1.default.delete(existingUserWithName.id);
            }
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const createdUser = await user_service_1.default.create({ email, password: hashedPassword, name, isActive: false });
        const token = jsonwebtoken_1.default.sign({ userId: createdUser.id }, process.env.JWT_SECRET);
        const link = `${consts_1.BACKEND_PAGES.CONFIRM_SIGNUP}/${token}`;
        await email_queue_1.emailQueue.add('sendActivationEmail', { email, link }, { attempts: 5, backoff: { type: 'fixed', delay: 1000 } });
        return 'Confirmation email sent';
    }
    async logout(req, res) {
        var _a;
        redis_1.default.del(`user:${(_a = req.user) === null || _a === void 0 ? void 0 : _a.id}`);
        (0, jwt_utils_1.removeJwtCookie)(res);
        res.send();
    }
    async getCurrentUser(req, res) {
        return Object.assign(Object.assign({}, req.user), { password: undefined });
    }
    async getCurrentUserComments(req, res) {
        var _a;
        return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.comments) || [];
    }
    async setAvatar(req, res) {
        if (!req.user)
            throw new Error();
        const { avatar } = req.files;
        if (!avatar) {
            res.status(400);
            return 'Avatar is required';
        }
        const allowedAvatarExtensions = ['gif', 'jpg', 'png', 'jpeg'];
        const avatarExtension = avatar.mimetype.split('/')[1];
        console.log(avatarExtension);
        if (!allowedAvatarExtensions.includes(avatarExtension)) {
            res.status(400);
            return 'Only gif, jpg, png extensions accepted. Wrong extension.';
        }
        const image = (0, sharp_1.default)(avatar.tempFilePath, { animated: avatarExtension === 'gif' });
        const metadata = await image.metadata();
        if (metadata.width && metadata.height && (metadata.width > 320 || metadata.height > 240)) {
            const resizedImage = await image.resize(320, 240).toBuffer();
            avatar.data = resizedImage;
        }
        await (0, firebase_1.deleteAvatarFromFirebase)(req.user.id);
        const url = await (0, firebase_1.uploadAvatarToFirebase)(avatar, req.user.id);
        const user = await user_service_1.default.setAvatar(req.user.id, url);
        await redis_1.default.setEx(`user:${req.user.id}`, 3600, JSON.stringify(user));
        await (0, scanAndDelete_1.scanAndDelete)('comments:*');
        return { url, message: 'Avatar has been changed' };
    }
    async setHomepage(req, res) {
        var _a, _b;
        if (!req.user)
            throw new Error();
        const { homepage } = req.body;
        await joi_1.default.string().uri().required().validateAsync(homepage);
        const user = await user_service_1.default.setHomepage((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, homepage);
        await redis_1.default.setEx(`user:${(_b = req.user) === null || _b === void 0 ? void 0 : _b.id}`, 3600, JSON.stringify(user));
        return 'Homepage changed successfully';
    }
};
UserController = __decorate([
    try_catch_decorator_1.default,
    __metadata("design:paramtypes", [])
], UserController);
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map