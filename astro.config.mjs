import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';

dotenv.config();

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    integrations: [react(), tailwind()],
    output: 'static',
    site:
        process.env.IS_NHD_TARGET === 'true'
            ? 'https://site.nhd.org'
            : `https://${process.env.GH_OWNER}.github.io/`,
    base:
        process.env.IS_NHD_TARGET === 'true'
            ? `/${process.env.SITE_URL}`
            : `/${process.env.GH_REPO}`,
    build: {
        assets: 'uploaded'
    }
});
