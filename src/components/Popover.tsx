import React from 'react';
import type { ReactNode } from 'react';

type AnchorLocation = 'top' | 'left' | 'right' | 'bottom';

const anchorMap: {
    [key in AnchorLocation]: string;
} = {
    top: 'top-0',
    left: 'left-0',
    right: 'right-0',
    bottom: 'bottom-0'
};

type OriginPoint =
    | 'top-left'
    | 'top'
    | 'top-right'
    | 'left'
    | 'center'
    | 'right'
    | 'bottom-left'
    | 'bottom'
    | 'bottom-right';

const originMap: {
    [key in OriginPoint]: string;
} = {
    'top-left': 'origin-top-left',
    top: 'origin-top',
    'top-right': 'origin-top-right',
    left: 'origin-left',
    center: 'origin-center',
    right: 'origin-right',
    'bottom-left': 'origin-bottom-left',
    bottom: 'origin-bottom',
    'bottom-right': 'origin-bottom-right'
};

export const Popover = ({
    children,
    className,
    origin,
    anchor,
    parrentId,
    boxName
}: {
    children: ReactNode;
    className: string;
    origin: OriginPoint;
    anchor: AnchorLocation;
    parrentId: string;
    boxName?: string;
}) => {
    return (
        <div className={
            'transition-all will-change-transform pointer-events-none w-64 scale-75 flex absolute z-10 opacity-0 ' +
            originMap[origin] +
            ' ' +
            anchorMap[anchor] +
            ' ' +
            className
        }>
            <ul
                className='w-full max-h-84 flex list-none flex-col overflow-scroll rounded-md border-2 border-gray-200 bg-gray-100 pt-1 pb-1 shadow-xl dark:border-gray-700 dark:bg-gray-800 '
                aria-label={boxName ? boxName : 'popover'}
                id={parrentId + '-popover'}
            >
                {children}
            </ul>
        </div>
    );
};
