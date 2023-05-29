import { Response } from 'express';
export declare const addJwtCookie: (res: Response, payload: any) => string;
export declare const removeJwtCookie: (res: Response) => void;
