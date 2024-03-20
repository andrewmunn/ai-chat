// NewThreadButton.tsx
import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

interface NewThreadButtonProps {
    onClick: () => void;
}

const NewThreadButton: React.FC<NewThreadButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <PencilIcon className="p-3" />
        </button>
    );
};

export default NewThreadButton;