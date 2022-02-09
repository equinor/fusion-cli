import { AuthApp, AuthContainer, AuthUser } from '@equinor/fusion';
export default class AppAuthContainer extends AuthContainer {
    get auth(): import("@equinor/fusion-framework-module-msal").IAuthProvider;
    constructor();
    get account(): import("@azure/msal-common").AccountInfo | undefined;
    requiresAuth(): Promise<void>;
    loginAsync(clientId: string): Promise<void>;
    /**
     * dunno if we kan handle single logout for a client id?
     */
    logoutAsync(clientId?: string): Promise<void>;
    getCachedUserAsync(): Promise<AuthUser>;
    getCachedUser(): AuthUser;
    acquireTokenAsync(resource: string): Promise<string | null>;
    /** internal registry of 'new' apps registred for msal */
    protected _registeredApps: Record<string, AuthApp>;
    registerAppAsync(clientId: string, resources: string[], legacy?: boolean): Promise<boolean>;
    /**
     * @deprecated
     */
    protected refreshTokenAsync(resource: string): Promise<string | null>;
}
