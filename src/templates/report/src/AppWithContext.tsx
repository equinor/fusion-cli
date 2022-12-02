<<<<<<< HEAD
import { FC, useMemo } from 'react';
import {
    registerApp,
    ContextTypes,
    Context,
    useCurrentContext,
    AppManifest,
} from '@equinor/fusion';
import { ErrorBoundary, PowerBIReport, IBasicFilter } from '@equinor/fusion-components';
import LandingPage from './LandingPage';

export const AppComponent: FC = () => {
    const currentContext = useCurrentContext();
    const globalId = '{GLOBALID}';

    const filter = useMemo((): IBasicFilter => {
        return {
            $schema: 'http://powerbi.com/product/schema#basic',
            target: {
                table: 'Dim_MasterProject', //change to specified table
                column: 'Project', //change to spcified column
            },
            filterType: 1,
            operator: 'In',
            values: [currentContext?.title || 'No context. Show empty report'],
        };
    }, [currentContext]);

    return (
        <ErrorBoundary>
            {!currentContext?.id && <LandingPage />}
            {currentContext?.id && (
                <PowerBIReport reportId={globalId} config={{ filters: [filter] }} hasContext />
            )}
        </ErrorBoundary>
    );
};

const context: AppManifest['context'] = {
    // add context types wihtin the square brackets-->ex. [ContextTypes.ProjectMaster, ContextTypes.Facility]
    types: [ContextTypes.ProjectMaster],
    buildUrl: (context: Context | null, _url: string) => {
        if (!context) return '';
        return `/${context.id}`;
    },
    getContextFromUrl: (url: string) => {
        const contextId = url.replace('/', '');
        return contextId.length > 10 ? contextId : '';
    },
};

registerApp('{appKey}', {
    AppComponent,
    context,
});

if (module.hot) {
    module.hot.accept();
}
=======
import { FC, useMemo } from 'react';
import {
    registerApp,
    ContextTypes,
    Context,
    useCurrentContext,
    AppManifest,
} from '@equinor/fusion';
import { ErrorBoundary, PowerBIReport, IBasicFilter } from '@equinor/fusion-components';
import LandingPage from './LandingPage';

export const AppComponent: FC = () => {
    const currentContext = useCurrentContext();
    const globalId = '{GLOBALID}';

    const filter = useMemo((): IBasicFilter => {
        return {
            $schema: 'http://powerbi.com/product/schema#basic',
            target: {
                table: 'Dim_MasterProject', //change to specified table
                column: 'Project', //change to spcified column
            },
            filterType: 1,
            operator: 'In',
            values: [currentContext?.title || 'No context. Show empty report'],
        };
    }, [currentContext]);

    return (
        <ErrorBoundary>
            {!currentContext?.id && <LandingPage />}
            {currentContext?.id && (
                <PowerBIReport reportId={globalId} config={{ filters: [filter] }} hasContext />
            )}
        </ErrorBoundary>
    );
};

const context: AppManifest['context'] = {
    // add context types wihtin the square brackets-->ex. [ContextTypes.ProjectMaster, ContextTypes.Facility]
    types: [ContextTypes.ProjectMaster],
    buildUrl: (context: Context | null, _url: string) => {
        if (!context) return '';
        return `/${context.id}`;
    },
    getContextFromUrl: (url: string) => {
        const contextId = url.replace('/', '');
        return contextId.length > 10 ? contextId : '';
    },
};

registerApp('{appKey}', {
    AppComponent,
    context,
});

if (module.hot) {
    module.hot.accept();
}
>>>>>>> cfc2d9f (Beta26 (#882))
