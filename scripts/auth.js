import fetch from 'node-fetch';
import setCookie from 'set-cookie-parser';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

export const loader = ora();

export const throwError = (message, debugData = null) => {
    loader.fail(
        chalk.bold(chalk.red('Error')) + ': ' + chalk.redBright(message)
    );
    debugData && console.log(debugData);
    process.exit(1);
};

export const getRes = (response) => {
    const { CrossedSite, Success, TokenFailed, Message, Body, IsAdmin } =
        response;

    if (!Success) {
        // Detect error message
        let detectedError = null;
        let errorType = null;
        if (CrossedSite) {
            detectedError = 'Detected Cross Site Request Forgery';
            errorType = 'xss';
        } else if (TokenFailed) {
            detectedError = 'Invalid CSRF Token';
            errorType = 'csrf';
        } else {
            detectedError = Message ?? 'Empty Error Message';
            errorType = 'unknown';
        }

        return {
            okay: false,
            error: detectedError,
            errorType
        };
    }

    return {
        okay: true,
        body: Body ?? undefined,
        isAdmin: IsAdmin
    };
};

const parseCookies = (cookies) => {
    const map = new Map();

    setCookie
        .parse(cookies, { decodeValues: true, silent: true })
        .forEach((cookie) => {
            map.set(cookie.name, cookie.value);
        });

    return map;
};

export const getReqToken = async (token, pageName, useSite = false) => {
    const url = new URL(`https://${useSite ? 'site' : 'website'}.nhd.org/`);
    url.pathname = pageName;

    const request = await fetch(url.toString(), {
        headers: {
            Cookie: `portal-session=${encodeURIComponent(token)}`
        }
    });

    if (!request.ok) {
        throwError('Token request failed');
    }

    // Find the csrf token in the html
    const html = await request.text();

    // var _requestToken = 'xxx';
    // Match the above line in the html
    const csrfToken = html.match(/var _requestToken = '(.*)';/)?.[1];

    if (!csrfToken) {
        throwError('Could not find CSRF Token');
    }

    return csrfToken;
};

const getInitialPageItems = async () => {
    const request = await fetch('https://website.nhd.org/');

    if (!request.ok) {
        throwError('Request to get tokens failed');
    }

    // Parse cookies into an object
    const parsedCookies = parseCookies(request.headers.get('set-cookie'));

    // Find the csrf token in the html
    const html = await request.text();

    // var _requestToken = 'xxx';
    // Match the above line in the html
    const csrfToken = html.match(/var _requestToken = '(.*)';/)?.[1];

    if (!csrfToken) {
        throwError('Could not find CSRF Token');
    }

    if (!parsedCookies.get('portalSession')) {
        throwError('Could not find portal-session cookie');
    }

    return {
        portalSession: parsedCookies.get('portalSession'),
        csrfToken
    };
};

const promptUsernamePassword = async () => {
    const { username, password } = await inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'Enter your NHD WebsiteBuilder username'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter your NHD WebsiteBuilder Password'
        }
    ]);

    return { username, password };
};

const doWebsiteAccess = async (portalSession) => {
    // Get the initial website access page
    const request = await fetch('https://website.nhd.org/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `portal-session=${encodeURIComponent(portalSession)}`
        }
    });

    if (!request.ok) {
        throwError('Could not access website (DoWebsiteAccess)');
    }

    // Get the page's html
    const html = await request.text();

    // Find the access page
    // href="/site/edit/{{UUID}}
    const pageRegex =
        /href="\/site\/edit\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})"/;
    const pageMatch = html.match(pageRegex)[1];

    if (!pageMatch) {
        throwError('Could not find page UUID');
    }

    const accessRequest = await fetch(
        'https://website.nhd.org/site/edit/' + encodeURIComponent(pageMatch),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `portal-session=${encodeURIComponent(portalSession)}`
            },
            redirect: 'manual'
        }
    );

    if (accessRequest.status !== 302) {
        throwError('Could not find redirect url (DoWebsiteAccess)');
    }

    // Get the redirect url
    const redirectUrl = accessRequest.headers.get('location');
    // Get the UUID from the redirect url
    const uuidRegex =
        /\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})/;
    const uuidMatch = redirectUrl.match(uuidRegex)[1];

    // Make a request to the redirect url
    const finalRequest = await fetch(
        'https://site.nhd.org/Access/index/' + encodeURIComponent(uuidMatch),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `portal-session=${encodeURIComponent(portalSession)}`
            }
        }
    );

    if (!finalRequest.ok) {
        throwError('Could not access website (DoWebsiteAccess)');
    }
};

const doAuthLogin = async (username, password, portalSession, csrfToken) => {
    const request = await fetch('https://website.nhd.org/User/SignIn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `portal-session=${encodeURIComponent(portalSession)}`
        },
        body: JSON.stringify({
            Body: {
                Username: username,
                Password: password
            },
            TimezoneOffSetMinutes: 0,
            Token: csrfToken
        })
    });

    if (!request.ok) {
        throwError('Could not authenticate');
    }

    const response = await request.json().catch(() => {
        throwError('Could not parse response as JSON');
    });

    const obj = getRes(response);

    if (!obj.okay) {
        // Detect error message
        throwError('[NHD Login Error] ' + obj.error);
    }

    return obj;
};

const handleToken = async (token) => {
    // Check if token is valid
    loader.start('Doing website access');
    await doWebsiteAccess(token);
    loader.succeed('Successfully did website access');

    return token;
};

export const getAuthToken = async (
    passedUsername = null,
    passedPassword = null,
    showKey = false
) => {
    const envToken = process.env.NHD_SITE_TOKEN;

    if (envToken && !passedUsername && !passedPassword) {
        loader.info('Detected site token in env.');

        return await handleToken(envToken);
    }

    // If username and password are passed, use those
    const { username, password } =
        passedUsername && passedPassword
            ? await (async () => {
                  loader.info('Using passed username and password');
                  return { username: passedUsername, password: passedPassword };
              })()
            : // Otherwise, prompt for username and password
              await (async () => {
                  loader.info('Requesting username and password');
                  return await promptUsernamePassword();
              })();

    // Get CSRF Token
    loader.start('Getting CSRF Token');
    const initialPageItems = await getInitialPageItems();
    loader.succeed('Successfully got CSRF Token');

    const portalSession = initialPageItems.portalSession;

    // Autuenticate token
    loader.start('Authenticating');
    const { isAdmin } = await doAuthLogin(
        username,
        password,
        portalSession,
        initialPageItems.csrfToken
    );
    await (async () => new Promise((resolve) => setTimeout(resolve, 200)))();

    // Get the website access page
    loader.start('Doing website access page');
    await doWebsiteAccess(portalSession);
    loader.succeed('Successfully got website access page');

    // Finalize
    loader.succeed('Successfully authenticated');
    loader.info(
        isAdmin
            ? chalk.bold(chalk.cyan('Nice!')) + ' Logged in as an admin!'
            : chalk.bold(
                  chalk.cyan('Hello ~~') + ' Logged in as a regular user.'
              )
    );
    showKey &&
        loader.info(
            chalk.bold('Place this line in a .env file: ') +
                'NHD_SITE_TOKEN=' +
                portalSession
        );

    // Do it twice to make sure it works
    return await handleToken(portalSession);
};
