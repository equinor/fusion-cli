import IAppVersion from "./AppVersion";

interface IAppManifest {
    name: string;
    shortName: string;
    key: string;
    main: string;
    version: IAppVersion;
    resources?: string[];
}

export default IAppManifest;