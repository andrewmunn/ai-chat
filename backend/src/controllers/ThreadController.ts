import Thread, { IThread } from '../models/Thread';

export async function createThread(title: string): Promise<IThread> {
    return await Thread.create({
        title: title,
        messages: [{ role: "system", content: "You are a helpful personal assistant." }]
    });
}