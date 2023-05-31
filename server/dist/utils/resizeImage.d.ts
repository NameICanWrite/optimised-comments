import { UploadedFile } from "express-fileupload";
export declare const resizeIfNecessary: (file: UploadedFile, isAnimated?: boolean) => Promise<void>;
