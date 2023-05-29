"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanAndDelete = void 0;
const redis_1 = __importDefault(require("../../config/redis"));
async function scanAndDelete(pattern, count = 10000) {
    let cursor = 0;
    const reply = await redis_1.default.scan(cursor, { MATCH: pattern, COUNT: count });
    for (const key of reply.keys) {
        cursor = reply.cursor;
        await redis_1.default.del(key);
    }
}
exports.scanAndDelete = scanAndDelete;
//# sourceMappingURL=scanAndDelete.js.map