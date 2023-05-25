import { Request, Response, NextFunction } from 'express';
import { User } from './User';
export declare class UserController {
    constructor();
    signup(req: Request, res: Response, next: NextFunction): Promise<{
        resBody: string;
        tokenPayload?: undefined;
    } | {
        resBody: string;
        tokenPayload: {
            userId: string;
        };
    }>;
    login(req: Request<any, any, {
        email: string;
        password: string;
    }>, res: Response, next: NextFunction): Promise<{
        resBody: string;
        tokenPayload?: undefined;
    } | {
        resBody: User;
        tokenPayload: {
            userId: string;
        };
    }>;
    activateUserAndRedirectToFrontend(req: Request, res: Response, next: NextFunction): Promise<void>;
    signUpAndSendActivationEmail(req: Request, res: Response, next: NextFunction): Promise<"Confirmation email sent" | {
        resBody: string;
    }>;
    sendResetPasswordCodeEmail(req: Request, res: Response, next: NextFunction): Promise<"Email with code sent" | {
        resBody: string;
    }>;
    resetPasswordWithCode(req: Request<any, any, {
        email: string;
        code: string;
        newPassword: string;
    }>, res: Response, next: NextFunction): Promise<"User doesnt exist" | "Code invalid or has expired" | "Password changed successfully!">;
    getCurrentUser(req: Request & {
        user: User;
    }, res: Response): Promise<{
        password: undefined;
        passwordResetCode: undefined;
        passwordResetCodeExpiresAt: undefined;
        id: string;
        email: string;
        name: string;
        avatar: string;
        isActive: boolean;
        comments: import("../comments/Comment").Comment[];
    }>;
    getCurrentUserComments(req: Request & {
        user: User;
    }, res: Response): Promise<import("../comments/Comment").Comment[]>;
    changePasswordSecure(req: Request<any, any, {
        oldPassword: string;
        newPassword: string;
    }> & {
        user: User;
    }, res: Response): Promise<"Old password incorrect" | "Password changed successfully">;
    changePassword(req: Request<any, any, {
        newPassword: string;
    }> & {
        user: User;
    }, res: Response): Promise<string>;
}
export declare const userController: UserController;
