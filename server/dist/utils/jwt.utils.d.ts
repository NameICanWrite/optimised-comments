import { Response } from 'express';
export declare const addJwtCookie: (res: Response, payload: any) => string;
export declare const removeJwtCookie: (res: Response) => void;
export declare function decodeAuthToken(req: any, res: any, next: any): Promise<void>;
