"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("./auth.middleware");
const try_catch_decorator_1 = __importDefault(require("../../utils/try-catch.decorator"));
const generic_validator_1 = __importDefault(require("../../utils/validation/generic.validator"));
const router = (0, express_1.Router)();
router.get('/activate/:token', auth_middleware_1.authAndGetUser, user_controller_1.userController.activateUserAndRedirectToFrontend);
router.post('/signup-and-send-activation-email', generic_validator_1.default.isBodyValidEntity('signup'), (0, try_catch_decorator_1.default)(user_controller_1.userController.signUpAndSendActivationEmail));
router.post('/login', generic_validator_1.default.isBodyValidEntity('login'), (0, auth_middleware_1.AddAuthToken)(user_controller_1.userController.login));
router.post('/send-password-reset-code', generic_validator_1.default.isBodyValidEntity('withEmail'), (0, try_catch_decorator_1.default)(user_controller_1.userController.sendResetPasswordCodeEmail));
router.post('/reset-password', generic_validator_1.default.isBodyValidEntity('resetPassword'), (0, try_catch_decorator_1.default)(user_controller_1.userController.resetPasswordWithCode));
router.post('/set-avatar', auth_middleware_1.authAndGetUser, (0, try_catch_decorator_1.default)(user_controller_1.userController.setAvatar));
router.post('/set-homepage', auth_middleware_1.authAndGetUser, (0, try_catch_decorator_1.default)(user_controller_1.userController.setHomepage));
router.get('/current', auth_middleware_1.authAndGetUser, (0, try_catch_decorator_1.default)(user_controller_1.userController.getCurrentUser));
router.get('/current/comments', auth_middleware_1.authAndGetUser, (0, try_catch_decorator_1.default)(user_controller_1.userController.getCurrentUserComments));
exports.default = router;
//# sourceMappingURL=user.route.js.map