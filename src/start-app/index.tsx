import { render } from '@hot-loader/react-dom';
import { useRef, FunctionComponent } from 'react';
import { Router } from 'react-router-dom';
import {
    createFusionContext,
    AuthContainer,
    FusionContext,
    ServiceResolver,
} from '@equinor/fusion';
import {
    FusionHeader,
    ContextSelector,
    FusionContent,
    FusionRoot,
    HeaderContentProps,
} from '@equinor/fusion-components';
import HotAppWrapper from './HotAppWrapper';

import { ThemeProvider } from '@equinor/fusion-react-styles';

// TODO: @odinr please fix me
const _customElementsDefine = window.customElements.define;
window.customElements.define = (name, cl, conf) => {
    if (!customElements.get(name)) {
        _customElementsDefine.call(window.customElements, name, cl, conf);
    } else {
        console.debug(`${name} has been defined twice`);
    }
};

const serviceResolver: ServiceResolver = {
    getContextBaseUrl: () => 'https://pro-s-context-ci.azurewebsites.net',
    getDataProxyBaseUrl: () => 'https://pro-s-dataproxy-ci.azurewebsites.net',
    getFusionBaseUrl: () => 'https://pro-s-portal-ci.azurewebsites.net',
    getMeetingsBaseUrl: () => 'https://pro-s-meeting-v2-ci.azurewebsites.net',
    getOrgBaseUrl: () => 'https://pro-s-org-ci.azurewebsites.net',
    getPowerBiBaseUrl: () => 'https://pro-s-powerbi-ci.azurewebsites.net',
    getProjectsBaseUrl: () => 'https://pro-s-projects-ci.azurewebsites.net',
    getTasksBaseUrl: () => 'https://pro-s-tasks-ci.azurewebsites.net',
    getPeopleBaseUrl: () => 'https://pro-s-people-ci.azurewebsites.net',
    getReportsBaseUrl: () => 'https://pro-s-reports-ci.azurewebsites.net',
    getPowerBiApiBaseUrl: () => 'https://api.powerbi.com/v1.0/myorg',
    getNotificationBaseUrl: () => 'https://pro-s-notification-ci.azurewebsites.net',
    getInfoUrl: () => 'https://pro-s-info-app-ci.azurewebsites.net',
    getFusionTasksBaseUrl: () => 'https://pro-s-tasks-ci.azurewebsites.net',
    getBookmarksBaseUrl: () => 'https://pro-s-bookmarks-ci.azurewebsites.net',
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
        serviceResolver.getReportsBaseUrl(),
        serviceResolver.getPowerBiApiBaseUrl(),
        serviceResolver.getNotificationBaseUrl(),
        serviceResolver.getBookmarksBaseUrl(),
    ]);

    const HeaderContextSelector: FunctionComponent<HeaderContentProps> = ({ app }) => {
        return app?.context?.types.length ? <ContextSelector /> : null;
    };

    if (!coreAppRegistered) {
        await authContainer.loginAsync(coreAppClientId);
    } else {
        const Root = () => {
            const root = useRef(document.createElement('div'));
            const overlay = useRef(document.createElement('div'));

            const headerContent = useRef<HTMLElement | null>(null);
            const headerAppAside = useRef<HTMLElement | null>(null);

            const fusionContext = createFusionContext(
                authContainer,
                serviceResolver,
                {
                    headerAppAside,
                    headerContent,
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
                        <ThemeProvider seed="fusion-dev-app">
                            <FusionRoot rootRef={root} overlayRef={overlay}>
                                <FusionHeader
                                    aside={null}
                                    content={HeaderContextSelector}
                                    start={null}
                                    settings={null}
                                />
                                <FusionContent>
                                    <HotAppWrapper />
                                </FusionContent>
                            </FusionRoot>
                        </ThemeProvider>
                    </FusionContext.Provider>
                </Router>
            );
        };

        render(<Root />, document.getElementById('fusion-app'));
    }
};

start()
    .then(() => console.log('App started'))
    .catch((e) => console.error('Unable to start app', e));
