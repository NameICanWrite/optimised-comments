"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeIfNecessary = void 0;
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = __importDefault(require("fs/promises"));
const resizeIfNecessary = async (file, isAnimated) => {
    const image = (0, sharp_1.default)(file.tempFilePath, { animated: isAnimated });
    const metadata = await image.metadata();
    if (metadata.width && metadata.height && (metadata.width > 320 || metadata.height > 240)) {
        const resizedImage = await image.resize(320, 240).toBuffer();
        await promises_1.default.writeFile(file.tempFilePath, resizedImage);
    }
};
exports.resizeIfNecessary = resizeIfNecessary;
//# sourceMappingURL=resizeImage.js.map