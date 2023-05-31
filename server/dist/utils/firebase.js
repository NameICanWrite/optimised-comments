"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAvatarFromFirebase = exports.uploadCommentFileToFirebase = exports.uploadAvatarToFirebase = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const uuid_1 = require("uuid");
const app = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(JSON.parse(process.env.FIREBASE_PRIVATE_KEY)),
    storageBucket: "my-test-tasks.appspot.com",
});
const storage = firebase_admin_1.default.storage(app);
const bucket = storage.bucket();
async function uploadAvatarToFirebase(avatar, userId) {
    const firebasePath = `avatars/${userId}/${(0, uuid_1.v4)() + avatar.name}`;
    await bucket.upload(avatar.tempFilePath, {
        destination: firebasePath
    });
    const fileRef = bucket.file(firebasePath);
    const [url] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
    });
    console.log('avatarurl = ' + url);
    return url;
}
exports.uploadAvatarToFirebase = uploadAvatarToFirebase;
async function uploadCommentFileToFirebase(avatar) {
    const firebasePath = `comment-files/${(0, uuid_1.v4)() + avatar.name}`;
    await bucket.upload(avatar.tempFilePath, {
        destination: firebasePath
    });
    const fileRef = bucket.file(firebasePath);
    const [url] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
    });
    console.log('comment file url = ' + url);
    return url;
}
exports.uploadCommentFileToFirebase = uploadCommentFileToFirebase;
async function deleteAvatarFromFirebase(userId) {
    var _a;
    const [files] = await bucket.getFiles({ prefix: `avatars/${userId}` });
    await ((_a = files[0]) === null || _a === void 0 ? void 0 : _a.delete());
}
exports.deleteAvatarFromFirebase = deleteAvatarFromFirebase;
//# sourceMappingURL=firebase.js.map