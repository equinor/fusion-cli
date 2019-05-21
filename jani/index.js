import React from 'react';
import { registerApp, useCurrentUser } from '@equinor/fusion';

const FusionApp = () => {
    const currentUser = useCurrentUser();

    if (!currentUser) {
        return null;
    }

    return <h1>Hello, {currentUser.fullName}</h1>;
};

registerApp('hello-world', {
    AppComponent: FusionApp,
});

if (module.hot) {
    module.hot.accept();
}
