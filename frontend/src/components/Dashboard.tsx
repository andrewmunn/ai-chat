// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import ThreadList from './ThreadList';
import ThreadView from './ThreadView';
import NewThreadButton from './NewThreadButton';
import api from '../utils/api';
import { Thread } from '../utils/Thread';

const Dashboard: React.FC = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        try {
            const response = await api.get('/thread');
            setThreads(response.data);
        } catch (error) {
            console.error('Failed to fetch threads:', error);
        }
    };

    const handleNewThread = async () => {
        setSelectedThreadId(null);
    };

    const handleThreadClick = (threadId: string) => {
        setSelectedThreadId(threadId);
    };

    const onThreadUpdated = (thread: Thread) => {
        setThreads(mergeThreads(threads, thread));
        setSelectedThreadId(thread._id);
    };

    const mergeThreads = (threads: Thread[], updatedThread: Thread): Thread[] => {
        const updatedThreads = threads.filter((thread) => thread._id !== updatedThread._id);
        return [updatedThread, ...updatedThreads];
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-100 p-4">
                <NewThreadButton onClick={handleNewThread} />
                <ThreadList threads={threads} selectedThreadId={selectedThreadId} onThreadClick={handleThreadClick} />
            </div>
            <div className="w-3/4 p-4">
                <ThreadView threadId={selectedThreadId} onThreadUpdated={onThreadUpdated} />
            </div>
        </div>
    );
};

export default Dashboard;