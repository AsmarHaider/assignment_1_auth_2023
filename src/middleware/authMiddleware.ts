// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
//import jwt from 'jsonwebtoken';


export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-token'];
    // here we can check api key, Api key can be used to differentiate clients (Android, iOS or web client)
    //to identify or limit no of calls etc
    // if (apiKey !== process.env.EXPECTED_API_KEY) {
    //     return res.status(401).json({ error: 'Invalid API key' });
    // }
    next();
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {


    // const token = req.headers['authorization']?.split(' ')[1];
    // if (!token) {
    //     return res.status(401).json({ error: 'No token provided' });
    // }

    try {


        // const secretOrPublicKey = process.env.JWT_SECRET;
        // if (!secretOrPublicKey) {
        //
        //     central logging microservice would be better to handle all kinda logs
        //     console.log("No public secret key found" + res.id+": "+Date.now()+" "+"some other params for error")
        //     return res.status(500).json({ error: 'Internal Server Error' });
        // }

        // Verify the token
        // const decoded = jwt.verify(token, secretOrPublicKey) as jwt.JwtPayload;
        // req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

