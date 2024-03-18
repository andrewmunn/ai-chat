import express, { Request, Response } from "express";
import Thread from "../models/Thread";
import authenticate from "../middleware/authenticate";

const router = express.Router();
router.use(authenticate);

router.get('/', async (req: Request, res: Response) => {
    res.json(await Thread.find({ userId: req.user._id }));
});

router.get('/:threadId', async (req: Request, res: Response) => {
    const thread = await Thread.findOne({ _id: req.params.threadId, userId: req.user._id });
    if (thread) {
        res.json(thread);
    } else {
        res.status(404).json({ error: "Thread not found" });
    }
});

router.delete('/:threadId', async (req: Request, res: Response) => {
    res.json(await Thread.findOneAndDelete({ _id: req.params.threadId, userId: req.user._id }));
});

router.delete('/:threadId/message/:messageId', async (req: Request, res: Response) => {
    const thread = await Thread.findOne({ _id: req.params.threadId, userId: req.user._id });
    if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
    }
    const index = thread.messages.findIndex(m => m._id.toString() === req.params.messageId);
    if (index === -1) {
        return res.status(404).json({ error: "Message not found" });
    }
    thread.messages.splice(index, 1);
    await thread.save();    
    res.json(thread);
});

export default router;