import { getAuthToken, getReqToken, loader, throwError } from './auth.js';
import {
    getSite,
    updatePageHTML,
    addPageMeta,
    editPageMeta,
    removePageMeta
} from './page.js';
import { createFile, removeFiles } from './file.js';
import xmlEscape from 'xml-escape';
import { program } from 'commander';
import dotenv from 'dotenv';

dotenv.config();

import path from 'node:path';
import fs from 'node:fs';

const distDir = path.join(process.cwd(), 'dist');

const main = async () => {
    // CLI stuff
    program
        .name('NHD Upload Tool')
        .description('Uploads a website to NHD Web Central.')
        .option('--use-env-auth-pair', 'Username')
        .option('-k, --show-key', 'Show the auth key');

    // Parse CLI arguments
    program.parse(process.argv);
    const options = program.opts();

    loader.start('Detecting files');
    // Get files that are folders
    const localFolders = fs
        .readdirSync(distDir, {
            withFileTypes: true
        })
        .filter((file) => file.isDirectory());

    // Find folder named 'uploaded', get all files that are folders, and remove it from the list
    const uploadedFolderIndex = localFolders.findIndex(
        (folder) => folder.name === 'uploaded'
    );
    const uploadedFolder = fs
        .readdirSync(
            path.join(distDir, localFolders[uploadedFolderIndex].name),
            {
                withFileTypes: true
            }
        )
        .filter((file) => file.isFile());

    localFolders.splice(uploadedFolderIndex, 1);

    // Get all webpages in the dist folder
    const pages = await Promise.all(
        localFolders.map(async (folder) => {
            // get index.html if it exists
            const htmlDir = path.join(distDir, folder.name, 'index.html');

            if (fs.existsSync(htmlDir)) {
                return {
                    name: folder.name,
                    htmlDir
                };
            } else {
                throwError('Could not find index.html in ' + folder.name);
            }
        })
    );

    loader.succeed('Finshed detecting files');

    // Authenticate
    const token = await getAuthToken(
        options.useEnvAuthPair ? process.env.NHD_USERNAME : undefined,
        options.useEnvAuthPair ? process.env.NHD_PASSWORD : undefined,
        options.showKey
    );
    const csrfToken = await getReqToken(token, 'Edit', true);

    // Get the site data
    loader.start('Getting site data');
    const site = await getSite(token, csrfToken);
    loader.succeed('Finished getting site data');

    // Remove all assets
    loader.start('Removing all old assets');
    const files = site.files;

    await removeFiles(
        token,
        files.map((file) => file.id)
    );
    loader.succeed('Finished removing all old assets');

    // Upload all assets
    loader.start('Uploading new assets');

    const replacementMap = new Map();

    await Promise.all(
        uploadedFolder.map(async (file) => {
            // Get file
            const fileData = fs.readFileSync(
                path.join(distDir, 'uploaded', file.name)
            );

            // Upload file
            const data = await createFile(token, {
                name: file.name,
                binary: fileData
            });

            // Add to replacement map
            if (replacementMap.get(xmlEscape('/uploaded/' + file.name))) {
                loader.warn(
                    'Duplicate file detected: ' +
                        file.name +
                        ' and ' +
                        data.name
                );
            }
            replacementMap.set(xmlEscape('/uploaded/' + file.name), xmlEscape(
                '/uploaded/' + data.name
            ));
        })
    );

    loader.succeed('Finished uploading new assets');

    // Remove all previous pages
    loader.start('Removing all old pages');
    await Promise.all(
        site.pages.map(async (page) => {
            if (page.name === 'home') {
                return;
            }
            // Remove page
            await removePageMeta(token, page.id);
        })
    );
    loader.succeed('Finished removing all old pages');

    // Create pages
    const pageItems = [];

    // Get home page
    const homePage = site.pages.find((page) => page.name === 'home');

    if (!homePage) {
        throwError('Could not find home page');
    }

    loader.start('Creating pages');
    await Promise.all(
        pages.map(async (page) => {
            const pageHtml = fs.readFileSync(page.htmlDir, 'utf8');

            const title =
                pageHtml.match(/<title>(.*?)<\/title>/)[1] ?? 'Unknown';

            // Create page
            const request =
                page.name !== 'home'
                    ? await addPageMeta(token, csrfToken, page.name, title)
                    : await editPageMeta(
                          token,
                          csrfToken,
                          homePage.id,
                          'home',
                          title
                      );

            // Add to pageItems
            pageItems.push({
                id: request.id,
                name: request.name,
                title: title,
                createdAt: request.createdAt,
                pageData: pageHtml
            });
        })
    );
    loader.succeed('Finished creating pages');

    // Update pages
    loader.start('Updating pages');
    await Promise.all(
        pageItems.map(async (page) => {
            // Make a copy of page data
            let pageData = page.pageData;

            // Loop through replacement map
            for (const [key, value] of replacementMap.entries()) {
                pageData = pageData.replace(key, value);
            }
            

            // Update page
            return await updatePageHTML(
                token,
                csrfToken,
                page.id,
                pageData,
                page.name,
                page.title,
                page.createdAt
            );
        })
    );
    loader.succeed('Finished updating pages');

    loader.info('Finished uploading');
};

main();
