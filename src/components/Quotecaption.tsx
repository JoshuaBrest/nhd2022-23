import React from 'react';

interface Props {
    quote: string;
    citation: string;
    float: 'left' | 'right';
    className?: string;
}

export const Quotecaption = ({
    quote,
    citation,
    float,
    className = ''
}: Props) => {
    return (
        <div
            className={
                (float === 'left'
                    ? 'desktop:float-left desktop:mr-8'
                    : 'desktop:float-right desktop:ml-8') +
                ' mt-4 mb-4 flex w-full items-center justify-center desktop:w-auto'
            }
        >
            <figure
                className={
                    'flex max-w-[22rem] flex-col overflow-hidden ' + className
                }
            >
                <p className='flex flex-col items-start font-medium'>
                    <svg
                        aria-hidden={true}
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 48 48'
                        className='-ml-1 h-10 w-10 scale-x-[-1] fill-current text-gray-500 gradient-mask-b-0 dark:text-accent-500'
                    >
                        <path d='M34.85 34q-1.25 0-1.875-1.025T32.9 30.85L35.3 26H29q-1.25 0-2.125-.875T26 23v-8q0-1.25.875-2.125T29 12h8q1.25 0 2.125.875T40 15v10.7q0 .35-.075.7t-.225.65l-2.9 5.75q-.25.55-.775.875Q35.5 34 34.85 34Zm-18 0q-1.25 0-1.875-1.025T14.9 30.85L17.3 26H11q-1.25 0-2.125-.875T8 23v-8q0-1.25.875-2.125T11 12h8q1.25 0 2.125.875T22 15v10.7q0 .35-.075.7t-.225.65l-2.9 5.75q-.25.55-.775.875Q17.5 34 16.85 34Z' />
                    </svg>
                    {quote}
                </p>
                <figcaption className='mt-2 w-fit max-w-full text-sm italic text-gray-700 dark:text-gray-200'>
                    {citation}
                </figcaption>
            </figure>
        </div>
    );
};
