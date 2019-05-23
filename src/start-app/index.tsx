import { render } from '@hot-loader/react-dom';
import {
    AuthContainer,
    FusionContext,
    ServiceResolver,
    createFusionContext,
} from '@equinor/fusion';

import * as React from 'react';
import { Router } from 'react-router';
import {FusionHeader} from '@equinor/fusion-components';
import AppWrapper from './components/AppWrapper';

const serviceResolver: ServiceResolver = {
    getDataProxyBaseUrl: () => 'https://pro-s-dataproxy-ci.azurewebsites.net',
};

console.log("HEADER", FusionHeader);
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
            const root = React.useRef(document.createElement('div'));
            const overlay = React.useRef(document.createElement('div'));

            const fusionContext = createFusionContext(authContainer, serviceResolver, {
                overlay,
                root,
            });

            return (
                <Router history={fusionContext.history}>
                    <FusionContext.Provider value={fusionContext}>
                        <div id="fusion-root" ref={root}>
                            <FusionHeader />
                            <AppWrapper />
                        </div>
                        <div id="overlay-container" ref={overlay} />
                    </FusionContext.Provider>
                </Router>
            );
        };

        render(<Root />, document.getElementById('fusion-app'));
    }
};

start();
