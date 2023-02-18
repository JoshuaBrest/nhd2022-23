import fetch from 'node-fetch';
import crypto from 'node:crypto';

import { throwError, getRes } from './auth.js';
import dotenv from 'dotenv';

dotenv.config();

export const parseDateFormat = (date) => {
    // Example: \/Date(1670317066790)\/
    const match = date.match(/Date\((\d+)\)/);
    if (!match) {
        throwError('Could not parse date');
    }

    return new Date(parseInt(match[1]));
};

const createDateFormat = (date) => {
    return `/Date(${date})/`;
};

export const parsePageData = (data) => {
    return {
        id: data.body.FriendlyKey,
        locked: data.body.Locked,
        sizeInKb: data.body.SizeInKB,
        files: data.body.UploadedFiles.map((file) => ({
            hash: file.Hash,
            name: file.Name,
            createdAt: parseDateFormat(file.CreatedAtUtc),
            updatedAt: parseDateFormat(file.UpdatedAtUtc),
            id: file.Id
        })),
        pages: data.body.Pages.map((page) => ({
            hash: page.Hash,
            name: page.Name,
            title: page.Title,
            createdAt: parseDateFormat(page.CreatedAtUtc),
            updatedAt: parseDateFormat(page.UpdatedAtUtc),
            id: page.Id
        }))
    };
};

export const getSite = async (token, csrfToken) => {
    const request = await fetch(
        'https://site.nhd.org/Edit/GetSiteDetails?Token=' +
            encodeURIComponent(csrfToken),
        {
            headers: {
                'Content-Type': 'application/json',
                Cookie: `portal-session=${encodeURIComponent(token)}`
            }
        }
    );

    if (!request.ok) {
        throwError('GetSiteDetails request failed');
    }

    const data = getRes(
        await request.json().catch((e) => {
            throwError(
                '[GetSite] Could not parse response as JSON. Are you logged in?',
                e
            );
        })
    );

    if (!data.okay) {
        throwError('[NHD GetSiteDetails Error] ' + data.error);
    }

    return parsePageData(data);
};

export const removePageMeta = async (token, pageId) => {
    const request = await fetch(
        'https://site.nhd.org/Edit/RemovePage/' + encodeURIComponent(pageId),
        {
            headers: {
                'Content-Type': 'application/json',
                Cookie: `portal-session=${encodeURIComponent(token)}`
            }
        }
    );

    if (!request.ok) {
        throwError('RemovePage request failed');
    }

    const data = getRes(
        await request.json().catch(() => {
            throwError(
                '[RemovePageMeta] Could not parse response as JSON. Are you logged in?'
            );
        })
    );

    if (!data.okay) {
        throwError('[NHD RemovePage Error] ' + data.error);
    }
};

export const editPageMeta = async (token, csrfToken, pageId, name, title) => {
    const request = await fetch('https://site.nhd.org/Edit/EditPage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `portal-session=${encodeURIComponent(token)}`
        },
        body: JSON.stringify({
            Body: {
                Name: name,
                Title: title,
                Id: pageId
            },
            TimezoneOffSetMinutes: 0,
            Token: csrfToken
        })
    });

    if (!request.ok) {
        throwError('EditPage request failed');
    }

    const data = getRes(
        await request.json().catch(() => {
            throwError(
                '[EditPageMeta] Could not parse response as JSON. Are you logged in?'
            );
        })
    );

    if (!data.okay) {
        throwError('[NHD EditPage Error] ' + data.error);
    }

    return {
        id: pageId,
        name,
        title
    };
};

export const addPageMeta = async (token, csrfToken, name, title) => {
    const request = await fetch('https://site.nhd.org/Edit/AddPage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `portal-session=${encodeURIComponent(token)}`
        },
        body: JSON.stringify({
            Body: {
                Name: name,
                Title: title,
                Template: '1',
                DuplicatePageId: 0
            },
            TimezoneOffSetMinutes: 0,
            Token: csrfToken
        })
    });

    if (!request.ok) {
        throwError('AddPage request failed');
    }

    const data = getRes(
        await request.json().catch(() => {
            throwError(
                '[AddPageMeta] Could not parse response as JSON. Are you logged in?'
            );
        })
    );

    if (!data.okay) {
        throwError('[NHD AddPage Error] ' + data.error);
    }

    const fullPage = parsePageData(data);

    const page = fullPage.pages.find((page) => page.name === name);

    // This is a hack to get the page ID. It's not in the response, so we have to get it from the full page data
    if (!page) {
        throwError('[AddPageMeta] Could not find page after adding');
    }

    return page;
};

export const updatePageHTML = async (
    token,
    csrfToken,
    pageId,
    html,
    name,
    title,
    createdAt
) => {
    const hasher = crypto.createHash('md5');

    const body = JSON.stringify({
        Body: {
            Css: '',
            Html: html,
            Data: JSON.stringify({
                'gjs-assets': '[]',
                'gjs-css': '',
                'gjs-html': html,
                'gjs-components': JSON.stringify({
                    content: '',
                    type: 'wrapper',
                    components: [
                        {
                            tagName: 'h1',
                            type: 'text',
                            content: 'Please do not edit this page.'
                        },
                        {
                            tagName: 'p',
                            type: 'text',
                            content:
                                'This page is automatically generated by the NHD website tool.'
                        },
                        {
                            tagName: 'h2',
                            type: 'text',
                            content: 'If you are a user and see this page'
                        },
                        {
                            tagName: 'p',
                            type: 'text',
                            content:
                                'You can view this page outside the nhd website with the link below.'
                        },
                        {
                            tagName: 'a',
                            type: 'link',
                            content: 'View Page',
                            attributes: {
                                href: `https://${process.env.GH_OWNER}.github.io/${process.env.GH_REPO}`,
                                title: 'View Page',
                                target: '_blank'
                            }
                        }
                    ]
                }),
                'gjs-styles': '[]'
            }),
            Page: {
                Name: name,
                Title: title,
                Id: pageId,
                Hash: hasher.update(html).digest('hex'),
                FromId: null,
                SizeKB: null,
                CreatedAtUtc: createDateFormat(createdAt),
                UpdatedAtUtc: createDateFormat(new Date())
            }
        },
        TimezoneOffSetMinutes: 0,
        Token: csrfToken
    });

    const request = await fetch('https://site.nhd.org/Edit/SavePage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `portal-session=${encodeURIComponent(token)}`
        },
        body
    });

    if (!request.ok) {
        throwError('SavePage request failed');
    }

    const data = getRes(
        await request.json().catch(() => {
            throwError(
                '[SavePage] Could not parse response as JSON. Are you logged in?'
            );
        })
    );

    if (!data.okay) {
        throwError('[NHD SavePage Error] ' + data.error);
    }
};
