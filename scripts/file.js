import { throwError, getRes } from './auth.js';
import { parsePageData } from './page.js';

import fetch from 'node-fetch';
import FormData from 'form-data';

export const createFile = async (token, file) => {
    const form = new FormData();

    form.append('files[]', file.binary, {
        filename: file.name
    });

    const request = await fetch('https://site.nhd.org/Edit/UploadFile', {
        method: 'POST',
        headers: {
            'Content-Type':
                'multipart/form-data; Boundary=' + form.getBoundary(),
            Cookie: `portal-session=${encodeURIComponent(token)}`
        },
        body: form
    });

    if (!request.ok) {
        throwError('Could not create files');
    }

    const data = getRes(
        await request.json().catch(() => {
            throwError(
                '[CreateFile] Could not parse response as JSON. Are you logged in?'
            );
        })
    );

    if (!data.okay) {
        throwError(
            '[NHD File Upload] (Check for files with simular names eg. "hello.test.txt" and "hello_test.txt") ' +
                data.error
        );
    }

    const websiteData = parsePageData(data);

    return websiteData.files[websiteData.files.length - 1];
};

export const createFiles = async (token, files) => {
    await Promise.all(files.map((file) => createFile(token, file)));
};

export const removeFile = async (token, fileId) => {
    const request = await fetch(
        'https://site.nhd.org/Edit/RemoveUploadedFile/' +
            encodeURIComponent(fileId),
        {
            headers: {
                'Content-Type': 'application/json',
                Cookie: `portal-session=${encodeURIComponent(token)}`
            }
        }
    );

    if (!request.ok) {
        throwError('Could not remove file');
    }

    // Route responce empty
};

export const removeFiles = async (token, fileIds) => {
    await Promise.all(fileIds.map((fileId) => removeFile(token, fileId)));
};
