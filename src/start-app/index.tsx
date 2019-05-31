import { render } from '@hot-loader/react-dom';
import {
    AuthContainer,
    FusionContext,
    ServiceResolver,
    createFusionContext,
    AppWrapper,
} from '@equinor/fusion';

import * as React from 'react';
import { Router } from 'react-router';
import { FusionHeader, FusionRoot, FusionContent } from '@equinor/fusion-components';

const serviceResolver: ServiceResolver = {
    getDataProxyBaseUrl: () => 'https://pro-s-dataproxy-ci.azurewebsites.net',
    getFusionBaseUrl: () => "https://pro-s-portal-ci.azurewebsites.net",
};

const start = async () => {
    const authContainer = new AuthContainer();
    await authContainer.handleWindowCallbackAsync();

    const coreAppClientId = '5a842df8-3238-415d-b168-9f16a6a6031b';
    const coreAppRegistered = await authContainer.registerAppAsync(coreAppClientId, [
        serviceResolver.getDataProxyBaseUrl(),
    ]);

    if (!coreAppRegistered) {
        authContainer.login(coreAppClientId);
    } else {
        const Root = () => {
            const [appKey, setAppKey] = React.useState("app-key");
            const root = React.useRef(document.createElement('div'));
            const overlay = React.useRef(document.createElement('div'));

            const fusionContext = createFusionContext(authContainer, serviceResolver, {
                overlay,
                root,
            });

            fusionContext.app.container.on("update", app => {
                setAppKey(app.appKey);
            });

            return (
                <Router history={fusionContext.history}>
                    <FusionContext.Provider value={fusionContext}>
                        <FusionRoot ref={root}>
                            <FusionHeader />
                            <FusionContent>
                                <AppWrapper appKey={appKey} />
                            </FusionContent>
                        </FusionRoot>
                        <div id="overlay-container" ref={overlay} />
                    </FusionContext.Provider>
                </Router>
            );
        };

        render(<Root />, document.getElementById('fusion-app'));
    }
};

start();
