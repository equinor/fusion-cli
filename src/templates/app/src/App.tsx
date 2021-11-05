import { useEffect, useCallback, useRef, useState } from 'react';
import { useCurrentUser, useNotificationCenter } from '@equinor/fusion';
import { usePopoverRef } from '@equinor/fusion-components';

import Button, { HTMLButtonCustomElement } from '@equinor/fusion-react-button';
import Icon from '@equinor/fusion-react-icon';

import useStyle from './App.style';

export const App = (): JSX.Element | null => {
  const currentUser = useCurrentUser();

  const sendNotification = useNotificationCenter();

  const styles = useStyle();

  const [click, setClick] = useState(0);

  // const popoverRef = useRef<HTMLButtonCustomElement>(null);

  const [popoverRef] = usePopoverRef<HTMLButtonCustomElement>(
    <div className={styles.popover}>What a lovely popover 💩</div>,
    {
      placement: 'below',
    }
  );

  const sendWelcomeNotification = useCallback(async () => {
    try {
      await sendNotification({
        id: 'This is a unique id which means the notification will only be shown once',
        level: 'medium',
        title: 'Welcome to your new fusion app! Open up src/index.tsx to start building your app!',
      });
    } catch (e) {
      console.error(e);
    }
  }, [sendNotification]);

  useEffect(() => {
    sendWelcomeNotification();
  }, []);

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.hello}>
      <h1>Oh hello there, {currentUser.fullName}</h1>
      <Button ref={popoverRef} label="Click me!" icon="accessible_forward" onClick={() => setClick(click + 1)}>
        <Icon slot="icon" icon="settings" />({click})
      </Button>
    </div>
  );
};

export default App;
