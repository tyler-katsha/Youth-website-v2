const production = true
const API_DEV = 'http://localhost:8080/api/v1'
const API_PROD = 'https://youthengedi-app-v1-0.onrender.com/api/v1'
const OAUTH_API_DEV = 'http://localhost:8080/oauth2/authorization'
const OAUTH_API_PROD = 'https://youthengedi-app-v1-0.onrender.com/oauth2/authorization'
export const API = production ? API_PROD : API_DEV
export const OAUTH_API = production ? OAUTH_API_PROD : OAUTH_API_DEV

