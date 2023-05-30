import { Response, Request, NextFunction } from 'express';
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
    redirectIfUserExists(req: Request, res: Response, next: NextFunction): Promise<void>;
    signUpAndSendActivationEmail(req: Request, res: Response, next: NextFunction): Promise<"User email already exists" | "User name already exists" | "Confirmation email sent">;
    logout(req: Request, res: Response): Promise<void>;
    getCurrentUser(req: Request, res: Response): Promise<{
        password: undefined;
        id?: number | undefined;
        email?: string | undefined;
        name?: string | undefined;
        avatarUrl?: string | undefined;
        homepage?: string | undefined;
        isActive?: boolean | undefined;
        comments?: import("../comments/Comment").Comment[] | undefined;
    }>;
    getCurrentUserComments(req: Request, res: Response): Promise<import("../comments/Comment").Comment[]>;
    setAvatar(req: Request, res: Response): Promise<"Avatar is required" | "Only gif, jpg, png extensions accepted. Wrong extension." | {
        url: string;
        message: string;
    }>;
    setHomepage(req: Request<any, any, {
        homepage: string;
    }>, res: Response): Promise<string>;
}
export declare const userController: UserController;
