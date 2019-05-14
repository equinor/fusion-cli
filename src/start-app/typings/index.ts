export interface IManifest {
    AppComponent: React.Component;
    failedToLoadAppBundle: boolean;
    isLoading: boolean;
}

export type AppRegistrationListener = (appKey: string, manifest: IManifest) => void;

export interface IRegisteredApps {
    appKey: string;
    manifest: IManifest;
}
