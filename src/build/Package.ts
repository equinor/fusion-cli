import IAppManifest from "./AppManifest";
import IDependencyList from "./DependencyList";

interface IPackage {
    name: string;
    main: string;
    version: string;
    manifest: IAppManifest;
    dependencies: IDependencyList;
    devDependencies: IDependencyList;
}

export default IPackage;