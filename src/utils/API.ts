const production = true;
const API_DEV = 'http://localhost:8080/api/v1';
const API_PROD = 'https://youthengedi-app-v1-0.onrender.com/api/v1';
const OAUTH_API_DEV = 'http://localhost:8080/oauth2/authorization';
const OAUTH_API_PROD = 'https://youthengedi-app-v1-0.onrender.com/oauth2/authorization';
const WEBSOCKET_API_DEV = 'ws://localhost:8080';
const WEBSOCKET_API_PROD = 'ws://youthengedi-app-v1-0.onrender.com';
export const API = production ? API_PROD : API_DEV;
export const OAUTH_API = production ? OAUTH_API_PROD : OAUTH_API_DEV
export const WEBSOCKET_API = production ? WEBSOCKET_API_PROD : WEBSOCKET_API_DEV;

