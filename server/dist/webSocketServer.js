"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocketServer = void 0;
const ws_1 = __importDefault(require("ws"));
function createWebSocketServer(server) {
    const wss = new ws_1.default.Server({ server });
    const wsClients = new Set();
    wss.on('connection', (ws) => {
        wsClients.add(ws);
        console.log('A client connected');
        ws.on('close', () => {
            wsClients.delete(ws);
            console.log('A client disconnected');
        });
    });
    return {
        wss,
        wsClients,
    };
}
exports.createWebSocketServer = createWebSocketServer;
//# sourceMappingURL=webSocketServer.js.map