"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("./auth.middleware");
const generic_validator_1 = __importDefault(require("../../utils/validation/generic.validator"));
const router = (0, express_1.Router)();
router.get('/activate/:token', auth_middleware_1.authAndGetUser, user_controller_1.userController.redirectIfUserExists);
router.post('/signup-and-send-activation-email', generic_validator_1.default.isBodyValidEntity('signup'), user_controller_1.userController.signUpAndSendActivationEmail);
router.post('/login', generic_validator_1.default.isBodyValidEntity('login'), user_controller_1.userController.login);
router.post('/logout', auth_middleware_1.authAndGetUser, user_controller_1.userController.logout);
router.post('/set-avatar', auth_middleware_1.authAndGetUser, user_controller_1.userController.setAvatar);
router.post('/set-homepage', auth_middleware_1.authAndGetUser, user_controller_1.userController.setHomepage);
router.get('/current', auth_middleware_1.authAndGetUser, user_controller_1.userController.getCurrentUser);
exports.default = router;
//# sourceMappingURL=user.route.js.map