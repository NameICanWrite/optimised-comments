"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const svg_captcha_1 = __importDefault(require("svg-captcha"));
const Captcha_1 = require("./Captcha");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const { data, text } = svg_captcha_1.default.create();
    const { id } = await Captcha_1.Captcha.save({ text });
    console.log('captcha created: ', `id: ${id}, text: ${text}`);
    return res.send({ id, svg: data });
});
exports.default = router;
//# sourceMappingURL=captcha.route.js.map