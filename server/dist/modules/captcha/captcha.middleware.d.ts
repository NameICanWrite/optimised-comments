import { NextFunction, Request, Response } from "express";
export declare const isCaptchaSolved: (req: Request, res: Response, next: NextFunction) => Promise<void | "Captcha is invalid">;
