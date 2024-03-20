// ThreadView.tsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Message, Thread } from '../utils/Thread';
import { set } from 'lodash';

interface ThreadViewProps {
    threadId: string | null;
    onThreadUpdated?: (thread: Thread) => void;
}

const ThreadView: React.FC<ThreadViewProps> = ({ threadId, onThreadUpdated: onThreadUpdated }) => {
    const [thread, setThread] = useState<Thread | null>(null);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (threadId) {
            fetchThread(threadId);
        } else {
            setThread(null);
        }
    }, [threadId]);

    const fetchThread = async (threadId: string) => {
        try {
            const response = await api.get(`/thread/${threadId}`);
            setThread(response.data);
        } catch (error) {
            console.error('Failed to fetch thread:', error);
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the bottom when the messages array changes
        if (thread?.messages && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [thread?.messages]);

    const handleSendMessage = async () => {
        if (message.trim() === '') {
            return;
        }
        setIsSending(true);
        if (thread) {
            // update the local thread object with the user's message
            const newMessage: Message = {
                _id: 'local_id',
                role: 'user',
                content: message,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const newThread: Thread = { ...thread, messages: [...thread.messages, newMessage] };
            setThread(newThread);
        }
        const oldMessage = message;
        try {
            setMessage('');
            const response = await api.post(`/completions/${thread?._id || ''}`, { content: message });
            const newThread = response.data;
            onThreadUpdated?.(newThread);
            setThread(newThread);
            setMessage('');
        } catch (error) {
            setMessage(oldMessage);
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
            inputRef.current?.focus();
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-2xl font-bold mb-4">{thread?.title || "Select a Thread or start a new one"}</h3>
            <div className="flex-grow overflow-y-auto mb-4">
                <ul className="space-y-4 mb-8">
                    {thread?.messages?.map((message) => (
                        <li key={message._id}>
                            <MessageView msg={message} />
                        </li>
                    ))}
                    {isSending && (
                        <li>
                            <div className="flex justify-start">
                                <div className="px-4 py-2 bg-gray-200 text-black rounded-lg">
                                    <div className="dot-typing"></div>
                                </div>
                            </div>
                        </li>
                    )}
                    <div ref={messagesEndRef} />
                </ul>
            </div>
            <div className="sticky bottom-0 bg-white py-4:">
                <div className="flex">
                    <input
                        type="text"
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Type your message..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"

                    />
                    <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 ml-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSending || message.trim() === ''}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

const MessageView: React.FC<{ msg: Message }> = ({ msg }) => {
    const isUserMessage = msg.role === 'user';

    return (
        <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`px-4 py-2 rounded-lg ${isUserMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                    }`}
            >
                {msg.content}
            </div>
        </div>
    );
};

export default ThreadView;