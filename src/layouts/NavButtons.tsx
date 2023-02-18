import React from 'react';

import { config } from '../utils/config';

const { menuOrder, baseUrl } = config;

interface Props {
    page: string;
}

export const NavButtons = ({ page }: Props) => {
    const filteredMenuOrder = menuOrder.filter(
        (link) => link.hideNavigate !== true
    );
    const pageIndex = filteredMenuOrder.findIndex((link) => link.url === page);

    const prev =
        pageIndex !== -1
            ? filteredMenuOrder[pageIndex - 1]
            : filteredMenuOrder[0];
    const next =
        pageIndex !== -1 ? filteredMenuOrder[pageIndex + 1] : undefined;

    return (
        <div className='flex w-full items-center justify-center p-4'>
            <div className='flex w-full max-w-3xl flex-col items-start gap-4 md:flex-row'>
                {pageIndex === 0 || !prev ? (
                    <div aria-hidden={true} className='flex-1'></div>
                ) : (
                    <a
                        href={baseUrl + prev?.url}
                        className='parent flex flex-1 flex-row items-center justify-center gap-5 self-start rounded-lg border-2 border-gray-200 bg-gray-100 p-4 pl-6 pr-6 transition-all hover:border-accent-200 hover:bg-accent-100 hover:text-accent-900 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-accent-700 dark:hover:bg-accent-800 dark:hover:text-accent-100'
                    >
                        <svg
                            className='h-8 w-8 fill-current'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 48 48'
                        >
                            <path d='m22.35 38.95-13.9-13.9q-.25-.25-.35-.5Q8 24.3 8 24q0-.3.1-.55.1-.25.35-.5L22.4 9q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05L13.1 22.5h24.8q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075-.425.425-1.075.425H13.1l11.4 11.4q.4.4.4 1t-.45 1.05q-.45.45-1.05.45-.6 0-1.05-.45Z' />
                        </svg>
                        <div className='flex flex-grow flex-col text-left'>
                            <span className='dark:group-hover: select-none text-xs font-bold uppercase group-hover:text-accent-700 dark:group-hover:text-accent-200'>
                                Previous
                            </span>
                            <span>{prev?.name}</span>
                        </div>
                    </a>
                )}
                {pageIndex === filteredMenuOrder.length - 1 || !next ? (
                    <div aria-hidden={true} className='flex-1'></div>
                ) : (
                    <a
                        href={baseUrl + next?.url}
                        className='group flex flex-1 flex-row items-center justify-center gap-5 self-end rounded-lg border-2 border-gray-200 bg-gray-100 p-4 pl-6 pr-6 transition-all hover:border-accent-200 hover:bg-accent-100 hover:text-accent-900 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-accent-700 dark:hover:bg-accent-900 dark:hover:text-accent-100'
                    >
                        <div className='flex flex-grow flex-col text-right'>
                            <span className='dark:group-hover: select-none text-xs font-bold uppercase group-hover:text-accent-700 dark:group-hover:text-accent-200'>
                                Next
                            </span>
                            <span>{next?.name}</span>
                        </div>
                        <svg
                            className='h-8 w-8 fill-current'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 48 48'
                        >
                            <path d='M22.95 38.9q-.4-.4-.4-1.05t.4-1.05l11.3-11.3H9.5q-.65 0-1.075-.425Q8 24.65 8 24q0-.65.425-1.075Q8.85 22.5 9.5 22.5h24.75l-11.3-11.3q-.4-.4-.4-1.075 0-.675.4-1.075.4-.4 1.05-.4t1.05.4l13.9 13.9q.25.25.35.5.1.25.1.55 0 .25-.1.525t-.35.525l-13.9 13.9q-.4.4-1.05.375-.65-.025-1.05-.425Z' />
                        </svg>
                    </a>
                )}
            </div>
        </div>
    );
};
