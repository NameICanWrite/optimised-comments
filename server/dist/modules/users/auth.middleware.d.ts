import { Request, Response, NextFunction } from 'express';
import { Strategy as JwtStrategy } from 'passport-jwt';
export declare const passportOptionsLogin: {
    jwtFromRequest: import("passport-jwt").JwtFromRequestFunction;
    secretOrKey: string;
};
export declare const passportJwtStrategyLoginWithActivation: JwtStrategy;
export declare const authAndGetUser: Function | undefined;
export declare function AddAuthToken(callback: any): (req: Request, res: Response, next: NextFunction) => Promise<string>;
export declare function addJwtHeader(res: Response, payload: Object): void;
