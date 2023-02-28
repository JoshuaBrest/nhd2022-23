import type { Link, SubMenu } from './config';

export const menuLinks: (Link | SubMenu)[] = [
    {
        name: 'Home',
        url: 'home',
        hideMenubar: true
    },
    {
        name: 'Background',
        links: [
            {
                name: 'Thesis',
                url: 'thesis'
            },
            {
                name: 'History of Encryption',
                url: 'history-of-encryption'
            }
        ]
    },
    {
        name: 'What Encryption Does?',
        links: [
            {
                name: 'Communicating with Encryption',
                url: 'what-encryption-does'
            },
            {
                name: 'Obtaining Information with Encrytion',
                url: 'information'
            },
            {
                name: 'Protect Government Agencies with Encryption',
                url: 'government'
            }
        ]
    },
    {
        name: 'Harms and Future',
        links: [
            {
                name: 'Harms of Encryption',
                url: 'counterclaim'
            },
            {
                name: 'Future of Encryption',
                url: 'future'
            }
        ]   
    },
    {
        name: 'Other',
        links: [
            {
                name: 'Process Paper',
                url: 'uploaded/process-paper.pdf',
                hideNavigate: true
            },
            {
                name: 'Works Cited',
                url: 'uploaded/works-cited.pdf',
                hideNavigate: true
            }
        ]
    }
];
