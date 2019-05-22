import React from 'react';
import { registerApp, useCurrentUser } from '@equinor/fusion';

import styles from './styles.css';

const FusionApp = () => {
    const currentUser = useCurrentUser();

    if (!currentUser) {
        return null;
    }

    return <h1 className={styles.hello}>Hello, {currentUser.fullName}</h1>;
};

registerApp('hello-world', {
    AppComponent: FusionApp,
});

if (module.hot) {
    module.hot.accept();
}
