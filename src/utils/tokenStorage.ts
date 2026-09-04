import type { AuthTokens } from '../types/auth';

const STORAGE_KEY = 'jwt-token';

export const tokenStorage = {
  getTokens: (): AuthTokens | null => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setTokens: (tokens: AuthTokens) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
export const saveAuthTokens = (data: AuthTokens) => {  
  localStorage.setItem("jwt-token", data.accessToken);
  localStorage.setItem("refresh-token", data.refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem("jwt-token");
  localStorage.removeItem("refresh-token");
  localStorage.removeItem("family-id");
  localStorage.removeItem("isGuest");
};