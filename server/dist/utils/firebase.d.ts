import { UploadedFile } from "express-fileupload";
export declare function uploadAvatarToFirebase(avatar: UploadedFile, userId: number): Promise<string>;
export declare function uploadCommentFileToFirebase(avatar: UploadedFile): Promise<string>;
export declare function deleteAvatarFromFirebase(userId: number): Promise<void>;
