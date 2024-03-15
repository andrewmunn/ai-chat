
import mongoose, { Schema, ObjectId, Types } from 'mongoose';

export interface IMessage extends mongoose.Document {
    _id: ObjectId;
    role: "system" | "user" | "assistant";
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
    role: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });


export interface IThread extends mongoose.Document {
    _id: ObjectId;
    messages: Types.DocumentArray<IMessage>;
    title: string;
    tokens: number;
    createdAt: Date;
    updatedAt: Date;
}

const ThreadSchema: Schema = new Schema({
    title: { type: String, required: true, default: "New Thread"},
    tokens: { type: Number, required: true, default: 0},
    messages: [MessageSchema],
}, { timestamps: true });

const Thread = mongoose.model<IThread>('Thread', ThreadSchema);

export default Thread;

