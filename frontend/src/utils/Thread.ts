export interface Thread {
    _id: string;
    userId: string;
    messages: Message[];
    title: string;
    tokens: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Message {
    _id: string;
    role: "system" | "user" | "assistant";
    content: string;
    createdAt: Date;
    updatedAt: Date;
}