import React from 'react';
import { config } from '../utils/config';

const { assetUrl } = config;

interface Props {
    src: string;
    alt: string;
    caption: string;
    float: 'left' | 'right';
    unsafeOverrideBasePath?: boolean;
    className?: string;
}

export const Figcaption = ({
    src,
    alt,
    caption,
    float,
    unsafeOverrideBasePath = false,
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
                    'flex max-w-[18rem] flex-col overflow-hidden rounded-lg p-1 ' +
                    className
                }
            >
                <img
                    src={unsafeOverrideBasePath ? src : assetUrl + src}
                    alt={alt}
                    className='margin-0 max-h-full max-w-full rounded-md border-2 border-gray-200 object-cover dark:border-accent-500'
                />
                <figcaption className='w-fit max-w-full p-1 text-sm italic text-gray-700 dark:text-gray-200'>
                    {caption}
                </figcaption>
            </figure>
        </div>
    );
};
