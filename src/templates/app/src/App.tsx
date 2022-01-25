import { useCallback, useEffect, useState } from 'react';

import { useNotificationCenter } from '@equinor/fusion';
import {
  useCurrentUser,
  useHttpClient,
  useFramework,
  useModuleContext,
} from '@equinor/fusion-framework-react-app/hooks';

import type { App } from './types';

export const AppComponent = (): JSX.Element => {
  const [apps, setApps] = useState<App[]>([]);
  const client = useHttpClient('portal');

  const sendNotification = useNotificationCenter();

  const sendWelcomeNotification = useCallback(async () => {
    await sendNotification({
      id: 'This is a unique id which means the notification will only be shown once',
      level: 'high',
      title: 'Welcome to your new fusion app! Open up src/index.tsx to start building your app!',
    });
  }, [sendNotification]);

  useEffect(() => {
    sendWelcomeNotification();
  }, [sendWelcomeNotification]);

  const framework = useFramework();
  const modules = useModuleContext();

  const account = useCurrentUser();

  useEffect(() => {
    client
      .fetchAsync('api/apps')
      .then((x) => x.json())
      .then(setApps);
  }, [client]);

  if (!apps.length) {
    return <span>Loading apps.....</span>;
  }

  return (
    <div>
      <h3>Current user</h3>
      <code>
        <pre>{JSON.stringify(account, null, 4)}</pre>
      </code>
      <h3>Registered modules in Framework</h3>
      <ul>
        {Object.keys(framework.modules).map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <h3>Registered modules in App</h3>
      <ul>
        {Object.keys(modules).map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <h3>List of registered apps in fusion</h3>
      <ul>
        {apps.map((x) => (
          <li key={x.key}>{x.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AppComponent;
