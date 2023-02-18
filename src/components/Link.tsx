import React from 'react';
import type { ReactNode } from 'react';

interface LinkProps {
    children?: ReactNode;
    className?: string;
    href: string;
}

export const Link = ({ children = <></>, className = '', href }: LinkProps) => {
    return (
        <a
            className={
                'text-accent-500 transition-all hover:text-accent-600 dark:text-accent-400 dark:hover:text-accent-300 ' +
                className
            }
            href={href}
        >
            {children}
        </a>
    );
};
