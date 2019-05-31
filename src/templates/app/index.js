import React from 'react';
import { registerApp, useCurrentUser } from '@equinor/fusion';

import styles from './styles.css';

const App = () => {
    const currentUser = useCurrentUser();

    if (!currentUser) {
        return null;
    }

    return <h1 className={styles.hello}>Hello, {currentUser.fullName}</h1>;
};

registerApp('{appKey}', {
    AppComponent: App,
});

if (module.hot) {
    module.hot.accept();
}
