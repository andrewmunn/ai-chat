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
        return res.status(400).json({ error: "Email already in use" });
    }
    // create user and save to database
    const user = new User({ email, password });
    await user.save();

    createAndReturnToken(user, res);

    res.status(201).json({ message: "Created user" });
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
    createAndReturnToken(user, res);

    res.status(200).json({ message: "Logged in" });

});

router.post('/logout', (req, res) => {
    if (!req.cookies.token) {
        return res.status(400).json({ error: "Cannot logout as there is no user logged in." });
    }
    res.clearCookie('token').json({ message: "Logged out" });
});

function createAndReturnToken(user: IUser, res: Response) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string);

    // create a date set to 1 year from now
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: date
    });
}

export default router;

