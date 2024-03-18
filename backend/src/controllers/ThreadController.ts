import Thread, { IThread } from '../models/Thread';
import { IUser } from '../models/User';

export async function createThread(user: IUser, title: string): Promise<IThread> {
    return await Thread.create({
        userId: user._id,
        title: title,
        messages: [{ role: "system", content: "You are a helpful personal assistant." }]
    });
}