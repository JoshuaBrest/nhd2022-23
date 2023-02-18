import { menuLinks } from './menu';

export interface Link {
    name: string;
    url: string;
    hideMenubar?: boolean;
    hideNavigate?: boolean;
}

export interface SubMenu {
    name: string;
    links: Link[];
}

export interface LinkGroup {
    name: string | false;
    links: Link[];
}

const groupLinks = (links: (Link | SubMenu)[]) => {
    // All link groups
    const groups: LinkGroup[] = [];
    // Current link group
    let group: LinkGroup = { links: [], name: false };

    // Loop through all links
    links.forEach((link) => {
        // If link is a submenu
        if (!Object.prototype.hasOwnProperty.call(link, 'url')) {
            // If current group has links, push it to groups
            if (group.links.length > 0) {
                groups.push(group);
                group = { links: [], name: false };
            }

            // Set group name and links
            group.name = (link as SubMenu).name;
            group.links = (link as SubMenu).links;
            groups.push(group);
            group = { links: [], name: false };
        } else {
            // If link is not a submenu, push it to current group
            group.links.push(link as Link);
        }
    });

    // If current group has links leftover, push it to groups
    if (group.links.length > 0) {
        groups.push(group);
    }

    return groups;
};

const orderGroups = (groups: LinkGroup[]) => {
    // All link orders
    const orders: Link[] = [];

    // Loop through all groups
    groups.forEach((group) => {
        // Loop through all links in group
        group.links.forEach((link) => {
            // Push link to orders
            orders.push(link);
        });
    });

    return orders;
};

export const assetPath = import.meta.env.BASE_URL + 'uploaded/';

export const config = {
    author: '',
    baseUrl: import.meta.env.BASE_URL,
    assetUrl: assetPath,
    siteName: '',
    menuLinks: menuLinks,
    menuGroups: groupLinks(menuLinks),
    menuOrder: orderGroups(groupLinks(menuLinks))
};
