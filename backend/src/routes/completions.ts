import express, { Request, Response } from "express";
import { sendMessage } from "../controllers/MessageController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.use(authenticate);

router.post('/', async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const response = await sendMessage(req.body.content, req.user)
        res.json(response);
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message });
    }
});

router.post('/:threadId', async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const response = await sendMessage(req.body.content, req.user, req.params.threadId)
        res.json(response);
    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ error: error.message });
    }
});

export default router;