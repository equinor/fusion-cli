import { AuthApp, AuthContainer, AuthUser } from '@equinor/fusion';
import { Fusion } from '@equinor/fusion-framework';
export default class AppAuthContainer extends AuthContainer {
    protected _auth: Fusion['modules']['auth'];
    constructor(_auth: Fusion['modules']['auth']);
    get account(): import("@equinor/fusion-framework-module-msal/client").AccountInfo | undefined;
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
