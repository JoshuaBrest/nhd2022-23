import React from 'react';
import type { ReactNode } from 'react';

interface TextProps {
    children?: ReactNode;
    className?: string;
    type: 'section' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'tldr';
    id?: string;
}

export const Text = ({
    children = <></>,
    className = '',
    type,
    id = ''
}: TextProps) => {
    if (type === 'section') {
        return (
            <section id={id} className={'pt-4 pb-5 ' + className}>
                {children}
            </section>
        );
    } else if (type === 'h1') {
        return (
            <h1 id={id} className={'pt-2 pb-3 text-3xl font-bold ' + className}>
                {children}
            </h1>
        );
    } else if (type === 'h2') {
        return (
            <h2 id={id} className={'pt-2 pb-3 text-2xl font-bold ' + className}>
                {children}
            </h2>
        );
    } else if (type === 'h3') {
        return (
            <h3 id={id} className={'pt-2 pb-3 text-xl font-bold ' + className}>
                {children}
            </h3>
        );
    } else if (type === 'h4') {
        return (
            <h4 id={id} className={'pt-2 pb-3 text-lg font-bold ' + className}>
                {children}
            </h4>
        );
    } else if (type === 'p') {
        return <p className='pt-1 pb-2'>{children}</p>;
    } else if (type === 'tldr') {
        return (
            <div id='tldr' className='pt-4 pb-5'>
                <section className='flex w-full max-w-2xl gap-4 rounded-md border-2 border-blue-200 bg-blue-100 p-4 transition-colors dark:border-blue-700 dark:bg-blue-900'>
                    <svg
                        aria-hidden={true}
                        aria-label='3 Lines Of Text Parargraph Icon'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-8 w-8 pt-1 text-blue-700 transition-colors dark:text-blue-200'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12'
                        />
                    </svg>
                    <div className='flex w-full flex-col'>
                        <span className='text-xs font-bold uppercase text-blue-700 transition-colors dark:text-blue-200'>
                            TLDR; Too long didn&apos;t read
                        </span>
                        <p
                            className={
                                'text-blue-900 dark:text-blue-50 ' + className
                            }
                        >
                            {children}
                        </p>
                    </div>
                </section>
            </div>
        );
    }
    return <></>;
};
