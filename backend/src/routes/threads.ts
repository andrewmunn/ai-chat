import express, { Request, Response } from "express";
import Thread from "../models/Thread";

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    res.json(Thread.find());
});

router.get('/:id', async (req: Request, res: Response) => {
    res.json(Thread.findById(req.params.id));
});

router.delete('/:id', async (req: Request, res: Response) => {
    res.json(Thread.findByIdAndDelete(req.params.id));
});

export default router;