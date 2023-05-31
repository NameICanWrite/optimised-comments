"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeJwtCookie = exports.addJwtCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtCookieOptions = {
    httpOnly: true,
};
if (process.env.NODE_ENV === 'production') {
    jwtCookieOptions.secure = true;
    jwtCookieOptions.sameSite = 'none';
    jwtCookieOptions.domain = process.env.ROOT_DOMAIN;
    jwtCookieOptions.path = '/';
}
const addJwtCookie = (res, payload) => {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRES_IN
    });
    const expires = new Date(Date.now() + parseInt(process.env.JWT_COOKIES_EXPIRES_IN) * 24 * 3600 * 1000);
    res.cookie('jwt', token, Object.assign(Object.assign({}, jwtCookieOptions), { expires }));
    return token;
};
exports.addJwtCookie = addJwtCookie;
const removeJwtCookie = (res) => {
    res.clearCookie('jwt', jwtCookieOptions);
};
exports.removeJwtCookie = removeJwtCookie;
//# sourceMappingURL=jwt.utils.js.map