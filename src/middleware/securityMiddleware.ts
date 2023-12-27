import { Request, Response, NextFunction } from 'express';


export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
    //we can check for headers, body for SQL injection attacks
    //or any kinda other attacks
    //for simplicity as described in assignment I have not implemented it
    next();
}