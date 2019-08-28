import {
    AuthContainer,
} from '@equinor/fusion';
import AuthApp from '@equinor/fusion/lib/auth/AuthApp';
import AuthNonce from '@equinor/fusion/lib/auth/AuthNonce';

export default class AppAuthContainer extends AuthContainer {
    protected buildLoginUrl(app: AuthApp, nonce: AuthNonce, customParams: object = {}) {
        const base =
            "https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/authorize";
        const params: any = {
            ...customParams,
            client_id: app.clientId,
            nonce: nonce.getKey(),
            redirect_uri: window.location.href,
            response_type: "id_token",
        };

        const queryString = Object.keys(params).reduce(
            (query, key) => query + `${query ? "&" : ""}${key}=${encodeURIComponent(params[key])}`,
            ""
        );

        return base + "?" + queryString;
    }
}