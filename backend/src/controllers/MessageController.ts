import Thread, { IThread } from "../models/Thread";
import { createThread } from "./ThreadController";
import getCompletion from "../api/CompletionsClient";

export async function sendMessage(content: string, threadId: string | null = null): Promise<IThread> {
    content = content.trim();
    if (content.length === 0) {
        throw new Error("Input cannot be empty");
    }

    const thread = threadId ? await Thread.findById(threadId) : await createThread("New Thread");
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