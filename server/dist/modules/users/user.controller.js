"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = __importDefault(require("./user.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const consts_1 = require("../../consts");
const mailer_1 = require("../../config/mailer");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const sharp_1 = __importDefault(require("sharp"));
const firebase_1 = require("../../utils/firebase");
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config();
class UserController {
    constructor() { }
    async signup(req, res, next) {
        const { email, password } = req.body;
        const existingUser = await user_service_1.default.findByEmail(email);
        if (existingUser) {
            res.status(400);
            return { resBody: 'User email already exists' };
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await user_service_1.default.create({ email, password: hashedPassword });
        return { resBody: 'Signed up successfully!', tokenPayload: { userId: newUser.id } };
    }
    async login(req, res, next) {
        const { email, password } = req.body;
        const user = await user_service_1.default.findByEmail(email);
        if (!user) {
            res.status(401);
            return { resBody: 'User doesnt exist' };
        }
        console.log(password);
        console.log(user.password);
        const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401);
            return { resBody: 'Password incorrect' };
        }
        if (!user.isActive) {
            res.status(401);
            return { resBody: 'Visit your email and activate user (user is inactive)' };
        }
        return { resBody: user, tokenPayload: { userId: user.id } };
    }
    async activateUserAndRedirectToFrontend(req, res, next) {
        if (!req.user) {
            return res.redirect(consts_1.FRONTEND_PAGES.TOKEN_CONFIRMATION_FAILURE);
        }
        await user_service_1.default.activate(req.user.id);
        return res.redirect(`${process.env.CLIENT_ROOT_URL}`);
    }
    async signUpAndSendActivationEmail(req, res, next) {
        const { email, password, name } = req.body;
        let existingUserWithEmail = await user_service_1.default.findByEmail(email);
        if (existingUserWithEmail) {
            if (existingUserWithEmail.isActive) {
                res.status(400);
                return { resBody: 'User email already exists' };
            }
            else {
                await user_service_1.default.delete(existingUserWithEmail.id);
            }
        }
        let existingUserWithName = await user_service_1.default.findByEmail(name);
        if (existingUserWithName) {
            if (existingUserWithName.isActive) {
                res.status(400);
                return { resBody: 'User name already exists' };
            }
            else {
                await user_service_1.default.delete(existingUserWithName.id);
            }
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const createdUser = await user_service_1.default.create({ email, password: hashedPassword, name, isActive: false });
        const token = jsonwebtoken_1.default.sign({ userId: createdUser.id }, process.env.JWT_SECRET);
        const link = `${consts_1.BACKEND_PAGES.CONFIRM_SIGNUP}/${token}`;
        await (0, mailer_1.sendMail)({
            subject: 'Comment App Signup Confirmation',
            email,
            html: `
    <p>Follow this link to signup</p>
    <a href="${link}">${link}</a>
    `,
            text: ''
        });
        return 'Confirmation email sent';
    }
    async sendResetPasswordCodeEmail(req, res, next) {
        const { email } = req.body;
        const existingUser = await user_service_1.default.findByEmail(email);
        if (!existingUser) {
            res.status(400);
            return { resBody: 'User doesnt exist' };
        }
        let newCode = '';
        for (let i = 0; i < 4; i++)
            newCode += crypto_1.default.randomInt(0, 9).toString();
        await user_service_1.default.addPasswordResetCode(email, newCode);
        await (0, mailer_1.sendMail)({
            subject: 'Comment App Signup Confirmation',
            email,
            html: `
    <p>Enter this code to reset password. It is valid during 10 minutes</p>
    <p>${newCode}</p>
    `,
            text: ''
        });
        return 'Email with code sent';
    }
    async resetPasswordWithCode(req, res, next) {
        const { email, code, newPassword } = req.body;
        const existingUser = await user_service_1.default.findByEmail(email);
        if (!existingUser) {
            res.status(400);
            return 'User doesnt exist';
        }
        const { passwordResetCode, passwordResetCodeExpiresAt } = existingUser;
        if (!(passwordResetCode == code || parseInt(passwordResetCodeExpiresAt) < Date.now())) {
            res.status(400);
            return 'Code invalid or has expired';
        }
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
        await user_service_1.default.changePassword(existingUser.id, hashedNewPassword);
        return 'Password changed successfully!';
    }
    async getCurrentUser(req, res) {
        const user = Object.assign(Object.assign({}, req.user), { password: undefined, passwordResetCode: undefined, passwordResetCodeExpiresAt: undefined });
        return user;
    }
    async getCurrentUserComments(req, res) {
        var _a;
        return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.comments) || [];
    }
    async changePasswordSecure(req, res) {
        var _a;
        const { oldPassword, newPassword } = req.body;
        const isPasswordCorrect = await bcrypt_1.default.compare(oldPassword, (_a = req.user) === null || _a === void 0 ? void 0 : _a.password);
        if (!isPasswordCorrect)
            return 'Old password incorrect';
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
        await user_service_1.default.changePassword(req.user.id, hashedNewPassword);
        return 'Password changed successfully';
    }
    async changePassword(req, res) {
        const { newPassword } = req.body;
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
        await user_service_1.default.changePassword(req.user.id, hashedNewPassword);
        return 'Password changed successfully';
    }
    async setAvatar(req, res) {
        const { avatar } = req.files;
        if (!avatar) {
            res.status(400);
            return 'Avatar is required';
        }
        const allowedAvatarExtensions = ['gif', 'jpg', 'png'];
        const avatarExtension = avatar.mimetype.split('/')[1];
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
        await user_service_1.default.setAvatar(req.user.id, url);
        return { url, message: 'Avatar has been changed' };
    }
    async setHomepage(req, res) {
        const { homepage } = req.body;
        await joi_1.default.string().uri().required().validateAsync(homepage);
        await user_service_1.default.setHomepage(req.user.id, homepage);
        return 'Homepage changed successfully';
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map