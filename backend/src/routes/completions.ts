import express, { Request, Response } from "express";
import { sendMessage } from "../controllers/MessageController";

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const response = await sendMessage(req.body.content)
        res.json(response);
    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
});

router.post('/:threadId', async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const response = await sendMessage(req.body.content, req.params.threadId)
        res.json(response);
    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
});

export default router;