import { render } from '@hot-loader/react-dom';
import {
    FusionContext,
    AuthContainer,
    ServiceResolver,
    createFusionContext,
} from '@equinor/fusion';
import * as React from 'react';
import { Router } from 'react-router-dom';
import { FusionHeader, FusionRoot, FusionContent } from '@equinor/fusion-components';
import HotAppWrapper from './HotAppWrapper';

const serviceResolver: ServiceResolver = {
    getContextBaseUrl: () => 'https://pro-s-context-pr-842.azurewebsites.net',
    getDataProxyBaseUrl: () => 'https://pro-s-dataproxy-ci.azurewebsites.net',
    getFusionBaseUrl: () => 'https://pro-s-portal-ci.azurewebsites.net',
    getMeetingsBaseUrl: () => 'https://pro-s-meeting-v2-ci.azurewebsites.net',
    getOrgBaseUrl: () => 'https://pro-s-org-ci.azurewebsites.net',
    getPowerBiBaseUrl: () => 'https://pro-s-powerbi-ci.azurewebsites.net',
    getProjectsBaseUrl: () => 'https://pro-s-projects-ci.azurewebsites.net',
    getTasksBaseUrl: () => 'https://pro-s-tasks-ci.azurewebsites.net',
    getPeopleBaseUrl: () => 'https://pro-s-people-ci.azurewebsites.net',
};

const start = async () => {
    const authContainer = new AuthContainer();
    await authContainer.handleWindowCallbackAsync();

    const coreAppClientId = '5a842df8-3238-415d-b168-9f16a6a6031b';
    const coreAppRegistered = await authContainer.registerAppAsync(coreAppClientId, [
        serviceResolver.getContextBaseUrl(),
        serviceResolver.getDataProxyBaseUrl(),
        serviceResolver.getFusionBaseUrl(),
        serviceResolver.getMeetingsBaseUrl(),
        serviceResolver.getOrgBaseUrl(),
        serviceResolver.getPowerBiBaseUrl(),
        serviceResolver.getProjectsBaseUrl(),
        serviceResolver.getTasksBaseUrl(),
        serviceResolver.getPeopleBaseUrl(),
    ]);

    if (!coreAppRegistered) {
        await authContainer.loginAsync(coreAppClientId);
    } else {
        const Root = () => {
            const root = React.useRef(document.createElement('div'));
            const overlay = React.useRef(document.createElement('div'));

            const fusionContext = createFusionContext(
                authContainer,
                serviceResolver,
                {
                    headerContent: React.useRef<HTMLElement | null>(null),
                    overlay,
                    root,
                },
                {
                    environment: {
                        env: 'dev',
                    },
                    loadBundlesFromDisk: false,
                }
            );

            return (
                <Router history={fusionContext.history}>
                    <FusionContext.Provider value={fusionContext}>
                        <FusionRoot rootRef={root} overlayRef={overlay}>
                            <FusionHeader aside={null} content={null} start={null} />
                            <FusionContent>
                                <HotAppWrapper />
                            </FusionContent>
                        </FusionRoot>
                    </FusionContext.Provider>
                </Router>
            );
        };

        render(<Root />, document.getElementById('fusion-app'));
    }
};

start()
    .then(() => console.log('App started'))
    .catch(e => console.error('Unable to start app', e));
