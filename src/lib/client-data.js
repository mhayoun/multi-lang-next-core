// src/lib/client-data.js


// We use require to ensure these are only loaded during the build for the specific client
export const getClientData = () => {

    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || 'default';

    console.log(`[ClientData] Active Client ID: ${clientId}`);

    try {
        return {
            menu: require(`@/src/data/${clientId}/menuData`).DEFAULT_MENU,
            news: require(`@/src/data/${clientId}/newsData`).DEFAULT_NEWS,
            footer: require(`@/src/data/${clientId}/footerData`).DEFAULT_FOOTER,
            home: require(`@/src/data/${clientId}/homeData`).DEFAULT_HOME,
        };
    } catch (error) {
        console.warn(`Data for client ${clientId} not found, falling back to default.`);
        // Fallback to a default client folder if needed
        return {
            menu: require(`@/src/data/default/menuData`).DEFAULT_MENU,
            news: require(`@/src/data/default/newsData`).DEFAULT_NEWS,
            footer: require(`@/src/data/default/footerData`).DEFAULT_FOOTER,
            home: require(`@/src/data/default/homeData`).DEFAULT_HOME,
        };
    }
};