import * as React from 'react';
import { useFusionContext, useNotificationCenter } from '@equinor/fusion';
import { AppManifest, useCurrentApp } from '@equinor/fusion/lib/app/AppContainer';
import { useAppAuth } from '@equinor/fusion/lib/hooks/useAppAuth';

const getFirstApp = (apps: Record<string, AppManifest>) => Object.keys(apps)[0];

const HotAppWrapper: React.FC = () => {
    const {
        app: { container: appContainer },
    } = useFusionContext();

    const currentApp = useCurrentApp();
    const sendNotification = useNotificationCenter();

    const authorized = useAppAuth(currentApp?.auth);

    React.useEffect(() => {
        !currentApp && appContainer.setCurrentAppAsync(getFirstApp(appContainer.allApps));

        return appContainer.on('update', (apps) => {
            appContainer.setCurrentAppAsync(getFirstApp(apps));
        });
    }, [appContainer.allApps]);

    React.useEffect(() => {
        sendNotification({
            cancelLabel: 'I know',
            level: 'low',
            title: 'App updated',
        })
            .then()
            .catch();
    }, [currentApp]);

    if (!currentApp || !authorized) {
        return null;
    }

    const AppComponent = currentApp.AppComponent;

    return AppComponent ? <AppComponent /> : null;
};

export default HotAppWrapper;
