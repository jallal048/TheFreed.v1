import React from 'react';

interface ToggleSwitchProps {
    id?: string;
    checked: boolean;
    onChange: () => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange }) => {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-indigo-500 ${
                checked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={onChange}
        >
            <span
                aria-hidden="true"
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};
