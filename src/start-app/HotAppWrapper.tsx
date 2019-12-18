import * as React from 'react';
import { useFusionContext, useNotificationCenter } from '@equinor/fusion';
import { AppManifest } from '@equinor/fusion/lib/app/AppContainer';

const HotAppWrapper: React.FC = () => {
    const {
        app: { container: appContainer },
    } = useFusionContext();
    const sendNotification = useNotificationCenter();

    const [app, setApp] = React.useState<AppManifest | null>(null);

    React.useEffect(() => {
        const allApps = appContainer.getAll();
        const onlyApp = allApps[0];

        if (onlyApp) {
            setApp(onlyApp);
            appContainer.setCurrentAppAsync(onlyApp.key);
        }

        return appContainer.on('update', setApp);
    }, []);

    React.useEffect(() => {
        sendNotification({
            cancelLabel: 'I know',
            level: 'low',
            title: 'App updated',
        })
            .then()
            .catch();
    }, [app]);

    if (!app) {
        return null;
    }

    const AppComponent = app.AppComponent;

    if (!AppComponent) {
        return null;
    }

    return <AppComponent />;
};

export default HotAppWrapper;
