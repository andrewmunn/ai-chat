import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUser;
    }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    // Get the JWT cookie from the request
    let token = req.cookies.token;

    if (!token) {
        // Get the JWT token from the request header
        const authHeader = req.headers.authorization;
        if (authHeader) {
            token = authHeader.split(' ')[1];
        }
    }

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify and decode the token
        const userId = jwt.verify(token, process.env.JWT_SECRET as string) as string;

        // Attach the decoded token to the request object
        req.user = await User.findById(userId);

        // Call the next middleware
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default authenticate;