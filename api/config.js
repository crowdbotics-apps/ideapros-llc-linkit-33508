export const defaultConfig = {
    API_URL: 'https://ideapros-llc-linkit-33508.botics.co/',
};

export const App = {
    config: defaultConfig,
};

window.env = window.env || defaultConfig;
App.config = { ...window.env };

export const API_URL = () => App.config.API_URL;
