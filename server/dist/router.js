"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comments_route_1 = __importDefault(require("./modules/comments/comments.route"));
const user_route_1 = __importDefault(require("./modules/users/user.route"));
class AppRouter {
    constructor(app) {
        this.app = app;
    }
    init() {
        this.app.get('/', (_req, res) => {
            res.send('API Running');
        });
        this.app.use('/api/comments', comments_route_1.default);
        this.app.use('/api/user', user_route_1.default);
    }
}
exports.default = AppRouter;
//# sourceMappingURL=router.js.map