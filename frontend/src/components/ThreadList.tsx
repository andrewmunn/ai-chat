// ThreadList.tsx
import React from 'react';
import { Thread } from '../utils/Thread';
import { formatDistanceToNow } from 'date-fns';


interface ThreadListProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onThreadClick: (threadId: string) => void;
}

const ThreadList: React.FC<ThreadListProps> = ({ threads, selectedThreadId, onThreadClick }) => {
  
  const formatTimestamp = (timestamp: Date) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Threads</h3>
      <ul className="space-y-2">
        {threads.map((thread) => (
          <li
            key={thread._id}
            onClick={() => onThreadClick(thread._id)}
            className={`cursor-pointer px-4 py-2 rounded ${thread._id === selectedThreadId ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'
              }`}
          >
            <div className="font-semibold">{thread.title}</div>
            <div className="text-sm">{formatTimestamp(thread.updatedAt)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadList;