import { Request, Response, NextFunction } from 'express';
import { User } from './User';
import { UploadedFile } from 'express-fileupload';
export declare class UserController {
    constructor();
    login(req: Request<any, any, {
        email: string;
        password: string;
    }>, res: Response, next: NextFunction): Promise<"User doesnt exist" | "Password incorrect" | "Visit your email and activate user (user is inactive)" | {
        password: undefined;
        id: number;
        email: string;
        name: string;
        avatarUrl: string;
        homepage: string;
        isActive: boolean;
        comments: import("../comments/Comment").Comment[];
    }>;
    redirectIfUserExists(req: Request & {
        user: User;
    }, res: Response, next: NextFunction): Promise<void>;
    signUpAndSendActivationEmail(req: Request, res: Response, next: NextFunction): Promise<"User email already exists" | "User name already exists" | "Confirmation email sent">;
    logout(req: Request & {
        user: User;
    }, res: Response): Promise<void>;
    getCurrentUser(req: Request & {
        user: User;
    }, res: Response): Promise<{
        password: undefined;
        id: number;
        email: string;
        name: string;
        avatarUrl: string;
        homepage: string;
        isActive: boolean;
        comments: import("../comments/Comment").Comment[];
    }>;
    getCurrentUserComments(req: Request & {
        user: User;
    }, res: Response): Promise<import("../comments/Comment").Comment[]>;
    setAvatar(req: Request<any, any, any> & {
        user: User;
        files: {
            avatar: UploadedFile;
        };
    }, res: Response): Promise<"Avatar is required" | "Only gif, jpg, png extensions accepted. Wrong extension." | {
        url: string;
        message: string;
    }>;
    setHomepage(req: Request<any, any, {
        homepage: string;
    }> & {
        user: User;
    }, res: Response): Promise<string>;
}
export declare const userController: UserController;
