import { NextFunction, Request, Response } from "express";
export declare class GenericValidator {
    constructor();
    isBodyValidEntity(Entity: any): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    isEntityExistsById(Entity: any): (req: Request, res: Response, next: NextFunction) => Promise<string | void>;
}
declare const validator: GenericValidator;
export default validator;
