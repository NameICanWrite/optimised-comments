"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAndGetUser = exports.passportJwtStrategyLoginWithActivation = exports.passportOptionsLogin = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const try_catch_decorator_1 = __importDefault(require("../../utils/try-catch.decorator"));
const user_service_1 = __importDefault(require("./user.service"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = __importDefault(require("../../config/redis"));
dotenv_1.default.config();
const extractorFromTokenParam = (req) => {
    let token = null;
    if (req && req.params.token) {
        token = req.params.token;
    }
    return token;
};
const extractorFromCookie = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};
exports.passportOptionsLogin = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([extractorFromCookie, extractorFromTokenParam]),
    secretOrKey: process.env.JWT_SECRET
};
exports.passportJwtStrategyLoginWithActivation = new passport_jwt_1.Strategy(exports.passportOptionsLogin, async ({ userId }, done) => {
    try {
        console.log(userId);
        let user;
        let cachedUser = await redis_1.default.get(`user:${userId}`);
        if (cachedUser) {
            user = JSON.parse(cachedUser);
            console.log('cachedUser', user);
        }
        else {
            user = await user_service_1.default.findById(userId);
        }
        if (!(user === null || user === void 0 ? void 0 : user.isActive))
            user = await user_service_1.default.activate(userId);
        if (!cachedUser)
            await redis_1.default.setEx(`user:${userId}`, 3600, JSON.stringify(user));
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (error) {
        return done(error, false);
    }
});
passport_1.default.use('jwt-login-with-activation', exports.passportJwtStrategyLoginWithActivation);
exports.authAndGetUser = (0, try_catch_decorator_1.default)(async (req, res, next) => {
    let errMessage;
    await new Promise((resolve, reject) => passport_1.default.authenticate('jwt-login-with-activation', { session: false }, (err, user) => {
        if (err || !user) {
            res.status(401);
            errMessage = 'You should login first!';
            console.log('Auth rejected');
            return resolve(1);
        }
        req.user = user;
        return resolve(1);
    })(req, res, next));
    return errMessage || next();
});
//# sourceMappingURL=auth.middleware.js.map