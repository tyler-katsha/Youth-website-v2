import type { ReactNode } from "react";

export const errorMessages: Record<string, string> = {
        account_disabled: "Your account has been disabled. Check email for verification link.",
        invalid_credentials: "Incorrect email or password.",
        account_locked: "Your account has been locked due to too many failed login attempts.",
        email_not_verified: "Please verify your email before signing in.",
        oauth_failed: "Google authentication failed. Please try again.",
        oauth_cancelled: "Google sign-in was cancelled.",
        token_missing: "Session expired",
        server_error: "Something went wrong. Please try again later."
};

export interface Props{
    children?: ReactNode;
    title?:string;
    message?:string;
}

export interface State{
    hasError:boolean;
    error?:Error;
}