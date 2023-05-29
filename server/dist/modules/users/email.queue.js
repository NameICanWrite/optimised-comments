"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const mailer_1 = require("../../config/mailer");
const emailQueue = new bull_1.default('email');
exports.emailQueue = emailQueue;
emailQueue.process('sendActivationEmail', async (job, done) => {
    const { email, link } = job.data;
    console.log(`sending email to ${email} ...`);
    try {
        if (job.attemptsMade < 3)
            throw new Error('attempt ' + (job.attemptsMade + 1));
        await (0, mailer_1.sendMail)({
            subject: 'Comment App Signup Confirmation',
            email,
            html: `
      <p>Follow this link to signup</p>
      <a href="${link}">${link}</a>
    `,
            text: ''
        });
        console.log(`email sent to ${email}`);
        return done();
    }
    catch (err) {
        console.log(err.message);
    }
});
//# sourceMappingURL=email.queue.js.map