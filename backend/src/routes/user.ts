import express, { Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import validator from "validator";
import { IUser } from "../models/User";

const router = express.Router();

router.post('/signup', async (req, res: Response) => {
    // extract email and password from request body
    const { email, password } = req.body;
    // check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    // validate password is at least 8 characters
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    // validate email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email" });
    }
    // check if email is already in use and return if it is
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "Email already in use. Try logging in. If you forgot your password, well you're fucked." });
    }
    // create user and save to database
    const user = new User({ email, password });
    await user.save();

    const token = createAndReturnToken(user, res);

    res.status(201).json({ token });
});

router.post('/login', async (req, res: Response) => {

    // extract email and password from request body
    const { email, password } = req.body;
    // check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: "Email or password incorrect" });
    }

    // validate password
    const valid = await user.comparePassword(password);
    if (!valid) {
        return res.status(404).json({ error: "Email or password incorrect" });
    }

    // generate jwt token
    const token = createAndReturnToken(user, res);

    res.status(200).json({ token });

});

router.post('/logout', (req, res) => {
    if (!req.cookies.token) {
        return res.status(400).json({ error: "Cannot logout as there is no user logged in." });
    }
    res.clearCookie('token').json({ message: "Logged out" });
});

router.get('/check', async (req, res) => {
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
        console.log('no token');
        return res.status(200).json({ isAuthenticated: false });
    }

    try {
        // Verify and decode the token
        const userId = jwt.verify(token, process.env.JWT_SECRET as string) as string;

        console.log(`JWT userId: ${userId}`);

        // verify a user exists with that id
        const user = await User.findById(userId);

        if (!user) {
            console.log(`no user with id ${userId}`);
            return res.status(200).json({ isAuthenticated: false });
        }

        return res.status(200).json({ isAuthenticated: true });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ isAuthenticated: false });
    }
});

function createAndReturnToken(user: IUser, res: Response): string {
    const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET as string);

    // create a date set to 1 year from now
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        expires: date
    });

    return token;
}

export default router;

