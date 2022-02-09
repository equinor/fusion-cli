import { AuthApp, AuthContainer, AuthToken, AuthUser } from '@equinor/fusion';
import { FusionAuthAppNotFoundError } from '@equinor/fusion/lib/auth/AuthContainer';

// from msal
type AccountInfo = {
  homeAccountId: string;
  environment: string;
  tenantId: string;
  username: string;
  localAccountId: string;
  name?: string;
};

const global = window as any;

/**
 * THIS IS ONLY TEMPORARY!!!
 * in future this should be deleted, when all apps are over on new framework!
 */
class FusionAuthUser {
  constructor(protected _info: AccountInfo) {}
  get id(): string {
    return this._info.localAccountId;
  }
  get fullName(): string {
    if (!this._info.name) {
      console.warn('[FusionAuthUser::fullName]: missing!');
      return '';
    }
    return this._info.name;
  }
  get givenName(): string {
    return this.fullName.split(' ').at(0) || '';
  }
  get familyName(): string {
    return this.fullName.split(' ').at(-1) || '';
  }
  get roles(): string[] {
    throw new Error('Method not implemented.');
  }
  get upn(): string {
    return this._info.username;
  }

  /** === DEPRECATED! === */
  mergeWithToken(_token: AuthToken): void {
    throw new Error('FusionAuthUser::mergeWithToken Method not implemented.');
  }
  toObject() {
    throw new Error('FusionAuthUser::toObject Method not implemented.');
  }
  toString() {
    throw new Error('FusionAuthUser::toString Method not implemented.');
  }
}

// TODO - get from msal module
type BrowserAuthError = {
  errorCode: string;
  /**
   * Detailed description of error
   */
  errorMessage: string;
  /**
   * Describes the subclass of an error
   */
  subError: string;
  /**
   * CorrelationId associated with the error
   */
  correlationId: string;
};

export default class AppAuthContainer extends AuthContainer {

  get auth() {
    return window.Fusion.modules.auth;
  }

  constructor() {
    super();
  }

  get account() {
    return this.auth.defaultClient.account;
  }

  public async requiresAuth(): Promise<void> {
    await this.auth.handleRedirect();
    if (!this.account) {
      try {
        await this.auth.login();
      } catch (e) {
        const { errorCode } = e as BrowserAuthError;
        if (errorCode === 'interaction_in_progress') {
          if (!(await this.auth.handleRedirect())) {
            window.sessionStorage.clear();
            window.location.reload();
          }
        }
      }
    }
  }

  async loginAsync(clientId: string): Promise<void> {
    await this.auth.handleRedirect();
    if (this._registeredApps[clientId]) {
      return this.auth.login();
    }
    console.trace(`FusionAuthContainer::loginAsync for client id [${clientId}]`);
    return super.loginAsync(clientId);
  }

  /**
   * dunno if we kan handle single logout for a client id?
   */
  public async logoutAsync(clientId?: string) {
    console.trace(`FusionAuthContainer::logoutAsync for client id [${clientId}]`);
    // TODO
    if (!clientId || this._registeredApps[clientId]) {
      return this.auth.defaultClient.logoutRedirect({
        postLogoutRedirectUri: '/sign-out',
        account: this.account,
      });
    }
    await super.logoutAsync(clientId);
    window.location.href = '/sign-out';
  }

  async getCachedUserAsync() {
    return this.getCachedUser();
  }

  getCachedUser() {
    if (!this.account) {
      throw Error('no logged in user!');
    }
    return new FusionAuthUser(this.account) as unknown as AuthUser;
  }

  async acquireTokenAsync(resource: string): Promise<string | null> {
    // window.Fusion
    const app = this.resolveApp(resource);
    if (app === null) {
      throw new FusionAuthAppNotFoundError(resource);
    }
    if (this._registeredApps[app.clientId]) {
      // TODO
      const defaultScope = ((window as any).clientId || '5a842df8-3238-415d-b168-9f16a6a6031b') + '/.default';
      const res = await this.auth.acquireToken({ scopes: [defaultScope] });
      if (res && res.accessToken) {
        return res.accessToken;
      }
      // if (!accessToken) {
      throw Error('failed to aquire token');
      // }
      // return accessToken;
    }
    console.trace(`FusionAuthContainer::acquireTokenAsync ${resource}`);
    return super.acquireTokenAsync(resource);
  }

  /** internal registry of 'new' apps registred for msal */
  protected _registeredApps: Record<string, AuthApp> = {};
  async registerAppAsync(clientId: string, resources: string[], legacy = true) {
    if (legacy) {
      console.warn(`registering legacy client for [${clientId}]`);
      return super.registerAppAsync(clientId, resources);
    }
    resources = resources.filter(Boolean);
    const app = this.resolveApp(clientId) ?? new AuthApp(clientId, resources);
    app.updateResources(resources);
    this._registeredApps[clientId] = app;
    this.apps.push(app);
    return true;
  }

  /**
   * @deprecated
   */
  protected async refreshTokenAsync(resource: string) {
    console.trace(`FusionAuthContainer::refreshTokenAsync legacy for resource [${resource}]`);
    const app = this.resolveApp(resource);

    if (app && app.clientId === global.clientId) {
      const refreshUrl = `/auth/refresh`;
      try {
        const response = await fetch(refreshUrl, {
          credentials: 'include',
          method: 'POST',
        });

        if (response.status === 200) {
          return response.text();
        }
      } catch (err) {
        // @todo AI
        console.error(err);
      }
    }

    return super.refreshTokenAsync(resource);
  }
}
