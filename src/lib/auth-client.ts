import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins"


export const { signIn, signUp, signOut, useSession, twoFactor } = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    cookiePrefix: "auth",
    cookieHttpOnly: process.env.NODE_ENV === "production",
    plugins: [
        twoFactorClient() 
    ]
});