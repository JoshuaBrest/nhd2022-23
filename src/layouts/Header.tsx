import React from 'react';

import { Popover } from '../components/Popover';
import { PopoverElement } from '../components/PopoverElement';
import { config, Link, SubMenu, LinkGroup } from '../utils/config';

const { baseUrl, menuGroups, menuLinks } = config;

export const Header = () => {
    return (
        <header
            role='menubar'
            className='sticky left-0 top-0 z-20 flex w-full justify-center border-b-2 border-gray-200 bg-gray-50 transition-all will-change-transform dark:border-gray-800 dark:bg-gray-900'
        >
            <div className='flex h-14 w-full max-w-4xl p-2 pr-3 pl-3'>
                <div className='flex'>
                    <a
                        href={baseUrl + 'home'}
                        className='transition-color flex cursor-pointer select-none items-center justify-center rounded p-2 pr-3 pl-3 text-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-800'
                    >
                        Home
                    </a>
                </div>
                <div className='flex flex-grow items-center justify-end'>
                    <div className='flex flex-grow items-center justify-end text-right'>
                        <div className='text-right'>
                            <div className='pointer-events-none absolute hidden w-0 items-center gap-3 overflow-hidden transition-all banner:pointer-events-auto banner:static banner:flex banner:w-auto banner:overflow-visible'>
                                {menuLinks.map((id: Link | SubMenu, key) => {
                                    if (
                                        Object.prototype.hasOwnProperty.call(
                                            id,
                                            'url'
                                        )
                                    ) {
                                        if ((id as Link).hideMenubar) {
                                            return <></>;
                                        }

                                        return (
                                            <a
                                                key={key}
                                                href={
                                                    baseUrl + (id as Link).url
                                                }
                                                className='peer flex items-center rounded p-2 pl-3 pr-3 transition-all hover:bg-gray-200 dark:hover:bg-gray-800'
                                            >
                                                {id.name}
                                            </a>
                                        );
                                    }
                                    return (
                                        <div
                                            key={key}
                                            className='relative inline-block'
                                        >
                                            <button
                                                aria-controls={
                                                    'pgint-header-dynamic-' +
                                                    key +
                                                    '-popover'
                                                }
                                                className='peer flex items-center rounded p-2 pl-3 pr-3 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800'
                                            >
                                                {id.name}
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    viewBox='0 0 48 48'
                                                    className='h-6 w-6 fill-current'
                                                >
                                                    <path d='M24 30.15q-.3 0-.55-.1-.25-.1-.5-.35l-9.9-9.9q-.4-.4-.375-1.075.025-.675.425-1.075.5-.5 1.075-.425.575.075 1.025.475l8.8 8.8 8.8-8.8q.4-.4 1.075-.45.675-.05 1.075.45.5.4.425 1.05-.075.65-.475 1.1l-9.85 9.85q-.25.25-.5.35-.25.1-.55.1Z' />
                                                </svg>
                                            </button>
                                            <Popover
                                                anchor='right'
                                                origin='top-right'
                                                className='mt-4 focus-within:pointer-events-auto focus-within:scale-100 focus-within:opacity-100 focus:pointer-events-auto focus:scale-100 focus:opacity-100 peer-focus:pointer-events-auto peer-focus:scale-100 peer-focus:opacity-100'
                                                parrentId={
                                                    'pgint-header-dynamic-' +
                                                    key
                                                }
                                                boxName={id.name}
                                            >
                                                {(id as SubMenu).links.map(
                                                    (id: Link, key) => {
                                                        if (id.hideMenubar) {
                                                            return <></>;
                                                        }

                                                        return (
                                                            <PopoverElement
                                                                key={key}
                                                                type='link'
                                                                link={
                                                                    baseUrl +
                                                                    id.url
                                                                }
                                                            >
                                                                {id.name}
                                                            </PopoverElement>
                                                        );
                                                    }
                                                )}
                                            </Popover>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center justify-center'>
                        <div className='relative inline-block text-left transition-all will-change-transform banner:pointer-events-none banner:absolute banner:hidden banner:w-0 banner:overflow-hidden'>
                            <button
                                aria-owns='pgint-header-mobile-hamburger-popover'
                                id='pgint-header-mobile-hamburger'
                                aria-label='Hamburger'
                                className='transition-color peer rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-800'
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 48 48'
                                    className='h-6 w-6 fill-current'
                                >
                                    <path d='M7.5 36q-.65 0-1.075-.425Q6 35.15 6 34.5q0-.65.425-1.075Q6.85 33 7.5 33h33q.65 0 1.075.425Q42 33.85 42 34.5q0 .65-.425 1.075Q41.15 36 40.5 36Zm0-10.5q-.65 0-1.075-.425Q6 24.65 6 24q0-.65.425-1.075Q6.85 22.5 7.5 22.5h33q.65 0 1.075.425Q42 23.35 42 24q0 .65-.425 1.075-.425.425-1.075.425Zm0-10.5q-.65 0-1.075-.425Q6 14.15 6 13.5q0-.65.425-1.075Q6.85 12 7.5 12h33q.65 0 1.075.425Q42 12.85 42 13.5q0 .65-.425 1.075Q41.15 15 40.5 15Z' />
                                </svg>
                            </button>
                            <Popover
                                anchor='right'
                                origin='top-right'
                                className='mt-4 gap-2 focus-within:pointer-events-auto focus-within:scale-100 focus-within:opacity-100 focus:pointer-events-auto focus:scale-100 focus:opacity-100 peer-focus:pointer-events-auto peer-focus:scale-100 peer-focus:opacity-100'
                                parrentId='pgint-header-mobile-hamburger'
                                boxName='Hamburger'
                            >
                                {menuGroups.map((id: LinkGroup, key) => {
                                    return (
                                        <div
                                            key={key}
                                            role='group'
                                            className='flex flex-col'
                                        >
                                            {id.name !== false ? (
                                                <PopoverElement
                                                    key={key}
                                                    type='divider-with-text'
                                                >
                                                    {id.name}
                                                </PopoverElement>
                                            ) : key !== 0 ? (
                                                <PopoverElement
                                                    key={key}
                                                    type='divider'
                                                />
                                            ) : (
                                                <></>
                                            )}
                                            {id.links.map((id: Link, key) => {
                                                if (id.hideMenubar) {
                                                    return <></>;
                                                }

                                                return (
                                                    <PopoverElement
                                                        key={key}
                                                        type='link'
                                                        link={baseUrl + id.url}
                                                    >
                                                        {id.name}
                                                    </PopoverElement>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
