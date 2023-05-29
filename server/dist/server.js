"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const joi_1 = __importDefault(require("joi"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./router"));
const database_1 = __importDefault(require("./config/database"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http"));
const webSocketServer_1 = require("./webSocketServer");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const { wss, wsClients } = (0, webSocketServer_1.createWebSocketServer)(server);
app.use((0, helmet_1.default)());
app.set('wsClients', wsClients);
const router = new router_1.default(app);
(0, database_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', process.env.CLIENT_ROOT_URL],
    methods: ["GET", "POST", "OPTIONS", "PATCH", "PUT", 'DELETE'],
    credentials: true,
    exposedHeaders: ['Authorization']
}));
app.set('port', process.env.PORT || 5000);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 }
}));
router.init();
const port = app.get('port');
app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof joi_1.default.ValidationError) {
        res.status(400).send(err.message);
    }
    if (!res.statusCode)
        res.status(500);
    res.send(err.message || 'Internal error');
});
server.listen(port, () => console.log(`Server started on port ${port}`));
//# sourceMappingURL=server.js.map