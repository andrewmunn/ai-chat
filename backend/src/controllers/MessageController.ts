import Thread, { IThread } from "../models/Thread";
import { createThread } from "./ThreadController";
import getCompletion from "../api/CompletionsClient";
import { IUser } from "../models/User";

export async function sendMessage(content: string, user: IUser, threadId: string | null = null): Promise<IThread> {
    if (!content) {
        throw new Error("Content cannot be empty");
    }
    content = content.trim();
    if (content.length === 0) {
        throw new Error("Content cannot be empty");
    }

    const thread = threadId ? await Thread.findOne({ _id: threadId, userId: user._id }) : await createThread(user, "New Thread");
    if (!thread) {
        throw new Error("Thread not found");
    }
    thread.messages.push({ role: "user", content: content });
    await thread.save();

    const response = await getCompletion(thread.messages);

    thread.messages.push({ role: "assistant", content: response });
    await thread.save();

    return thread;
}