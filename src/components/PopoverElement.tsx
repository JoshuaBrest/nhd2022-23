import React from 'react';
import type { ReactNode } from 'react';

interface PopoverProps {
    children?: ReactNode;
    className?: string;
    type: 'link' | 'divider' | 'divider-with-text' | 'text';
    link?: string;
}

export const PopoverElement = ({
    children = <></>,
    className = '',
    type,
    link = ''
}: PopoverProps) => {
    if (type === 'link') {
        return (
            <li className='flex w-full transition-colors hover:bg-accent-200 dark:hover:bg-accent-900'>
                <a
                    className={
                        'w-full cursor-pointer p-2 pl-4 pr-4 transition-colors hover:text-accent-900 dark:hover:text-accent-100' +
                        className
                    }
                    href={link}
                >
                    {children}
                </a>
            </li>
        );
    } else if (type === 'divider') {
        return (
            <div role='separator' className='flex w-full p-2 pr-3 pl-3'>
                <div
                    aria-hidden='true'
                    className={
                        'h-0.5 flex-1 rounded bg-gray-200 dark:bg-gray-700' +
                        className
                    }
                />
            </div>
        );
    } else if (type === 'divider-with-text') {
        return (
            <div
                role='separator'
                className='flex w-full items-center p-1 pb-0 pr-3 pl-3'
            >
                <span className='pr-2 text-xs font-bold uppercase text-gray-400'>
                    {children}
                </span>
                <div
                    aria-hidden='true'
                    className={
                        'h-0.5 flex-1 rounded bg-gray-200 dark:bg-gray-700' +
                        className
                    }
                />
            </div>
        );
    }
    return <></>;
};
