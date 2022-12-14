import { FC, useEffect } from 'react';
import { registerApp, useCurrentUser, useNotificationCenter } from '@equinor/fusion';
import { Button, usePopoverRef } from '@equinor/fusion-components';

const App: FC = () => {
  const currentUser = useCurrentUser();
  const sendNotification = useNotificationCenter();

  const [popoverRef] = usePopoverRef(<div className="popover">What a lovely popover 💩</div>, {
    placement: 'below',
  });

  const sendWelcomeNotification = async () => {
    await sendNotification({
      id: 'This is a unique id which means the notification will only be shown once',
      level: 'medium',
      title: 'Welcome to your new fusion app! Open up src/index.tsx to start building your app!',
    });
  };

  useEffect(() => {
    sendWelcomeNotification();
  }, []);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="hello">
      <h1>Oh hello there, {currentUser.fullName}</h1>
      <Button ref={popoverRef}>Click me!</Button>
    </div>
  );
};

registerApp('test-app', {
  AppComponent: App,
});

if (module.hot) {
  module.hot.accept();
}

/* import { registerApp } from '@equinor/fusion';
import { createComponent } from '@equinor/fusion-framework-react-app';

import { configureFramework } from './config';
import AppComponent from './App';

export const render = createComponent(AppComponent, configureFramework);

registerApp('test-app', {
  render,
  AppComponent,
});

if (module.hot) {
  module.hot.accept();
}

export default render;
 */
