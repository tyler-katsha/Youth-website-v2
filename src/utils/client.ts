import type { AuthTokens } from "../types/auth";
import { API } from "./API";
import { saveAuthTokens } from "./tokenStorage";
import { getToken, removeAll } from "./Utils";

let refreshPromise: Promise<AuthTokens | null> | null = null;

async function refreshAccessToken(): Promise<AuthTokens | null> {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const refreshToken = localStorage.getItem("refresh-token");

            if (!refreshToken) {
                return null;
            }

            const refreshRes = await fetch(`${API}/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refreshToken,
                }),
            });

            if (!refreshRes.ok) {
                return null;
            }

            const newTokens: AuthTokens = await refreshRes.json();

            saveAuthTokens(newTokens);

            return newTokens;
        } catch {
            return null;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {

    let accessToken = getToken();

    const headers = new Headers(options.headers || {});

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    let response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status !== 401) {
        return response;
    }

    const newTokens = await refreshAccessToken();

    if (!newTokens) {
        removeAll();
        window.location.href = "/login";
        return response;
    }

    accessToken = newTokens.accessToken;

    headers.set(
        "Authorization",
        `Bearer ${accessToken}`
    );

    response = await fetch(url, {
        ...options,
        headers,
    });

    return response;
}
export async function BigLogout(): Promise<void> {
  const accessToken = getToken();
  const familyId = localStorage.getItem("family-id");

  try {
    if (accessToken && familyId) {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          familyId,
        }),
      });
    }
  } finally {
    removeAll();
    window.location.href = "/login";
  }
}