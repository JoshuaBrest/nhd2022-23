/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'media',
    theme: {
        extend: {
            breakpoints: {
                desktop: '576px',
                banner: '864px'
            },
            // Add desktop size to make it easy
            screens: {
                desktop: '576px',
                banner: '864px'
            },
            fontFamily: {
                'source-sans': ['source-sans', 'system-ui'],
                'rubik-eighties-fade': ['rubik-eighties-fade', 'system-ui']
            },
            colors: {
                'gray-900': '#18181B',
                'gray-800': '#27272A',
                'gray-700': '#3F3F46',
                'gray-600': '#52525B',
                'gray-500': '#71717A',
                'gray-400': '#A1A1AA',
                'gray-300': '#D4D4D8',
                'gray-200': '#E4E4E7',
                'gray-100': '#F4F4F5',
                'gray-50': '#FAFAFA',
                'accent-900': '#881337',
                'accent-800': '#9F1239',
                'accent-700': '#BE123C',
                'accent-600': '#E11D48',
                'accent-500': '#F43F5E',
                'accent-400': '#FB7185',
                'accent-300': '#FDA4AF',
                'accent-200': '#FECDD3',
                'accent-100': '#FFE4E6',
                'accent-50': '#FFF1F2'
            }
        }
    },
    plugins: [require('tailwind-gradient-mask-image')]
};
