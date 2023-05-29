"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCaptchaSolved = void 0;
const Captcha_1 = require("./Captcha");
const try_catch_decorator_1 = __importDefault(require("../../utils/try-catch.decorator"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.isCaptchaSolved = (0, try_catch_decorator_1.default)(async (req, res, next) => {
    if (!process.env.IS_CAPTCHA_ON) {
        return next();
    }
    const { captchaId, captchaText } = req.body;
    const solution = await Captcha_1.Captcha.findOne({ where: { id: captchaId } });
    if (solution && captchaText === solution.text) {
        await Captcha_1.Captcha.delete(captchaId);
        next();
    }
    else {
        res.status(400);
        return 'Captcha is invalid';
    }
});
//# sourceMappingURL=captcha.middleware.js.map