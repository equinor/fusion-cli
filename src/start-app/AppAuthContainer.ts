import { AuthApp, AuthContainer, AuthToken, AuthUser } from '@equinor/fusion';
import { FusionAuthAppNotFoundError } from '@equinor/fusion/lib/auth/AuthContainer';

import { Fusion } from '@equinor/fusion-framework';
import { AuthUserJSON } from '@equinor/fusion/lib/auth/AuthUser';

// from msal
type AccountInfo = {
  homeAccountId: string;
  environment: string;
  tenantId: string;
  username: string;
  localAccountId: string;
  name?: string;
};

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

  /** @deprecated */
  get roles(): string[] {
    console.trace('FusionAuthUser::roles deprecation warning');
    return [];
  }
  get upn(): string {
    return this._info.username;
  }

  /** === DEPRECATED! === */
  mergeWithToken(_token: AuthToken): void {
    console.debug('FusionAuthUser::mergeWithToken', 'noop');
    // throw new Error("Method not implemented.");
  }
  toObject(): AuthUserJSON {
    console.debug('FusionAuthUser::toObject', 'legacy');
    return {
      id: this.id,
      familyName: this.familyName,
      fullName: this.fullName,
      givenName: this.givenName,
      roles: this.roles,
      upn: this.upn,
    };
  }

  toString(): string {
    console.debug('FusionAuthUser::toObject', 'legacy');
    return JSON.stringify(this.toObject());
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
<<<<<<< HEAD
  // 🥷🏻 remove me... please
  protected get _auth(): Fusion['modules']['auth'] {
    return window.Fusion.modules.auth;
=======
  constructor(protected _auth: Fusion['modules']['auth']) {
    super();
>>>>>>> 73625f670d77ba4d320327886a83edf152ef4fd5
  }

  get account() {
    return this._auth.defaultClient.account;
  }

  public async requiresAuth(): Promise<void> {
    await this._auth.handleRedirect();
    const { account } = this;
    // TODO - move logic to fusion framework
    const valid = account && (account.idTokenClaims as { exp: number })?.exp > Date.now() / 1000;
    if (!valid) {
      try {
        await this._auth.login();
      } catch (e) {
        const { errorCode } = e as BrowserAuthError;
        if (errorCode === 'interaction_in_progress') {
          if (!(await this._auth.handleRedirect())) {
            window.sessionStorage.clear();
            window.location.reload();
          }
        }
      }
    }
  }

  async loginAsync(clientId: string): Promise<void> {
    await this._auth.handleRedirect();
    if (this._registeredApps[clientId]) {
      return this._auth.login();
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
      return this._auth.defaultClient.logoutRedirect({
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
      const defaultScope = app.clientId + '/.default';
      const res = await this._auth.acquireToken({ scopes: [defaultScope] });
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
<<<<<<< HEAD
  async registerAppAsync(clientId: string, resources: string[], legacy = true): Promise<boolean> {
=======
  async registerAppAsync(clientId, resources, legacy = true) {
>>>>>>> 73625f670d77ba4d320327886a83edf152ef4fd5
    const isRegistered = !!this._registeredApps[clientId];
    if (!isRegistered && legacy) {
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
