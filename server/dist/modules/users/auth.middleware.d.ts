import { Strategy as JwtStrategy } from 'passport-jwt';
export declare const passportOptionsLogin: {
    jwtFromRequest: import("passport-jwt").JwtFromRequestFunction;
    secretOrKey: string;
};
export declare const passportJwtStrategyLoginWithActivation: JwtStrategy;
export declare const authAndGetUser: Function;
