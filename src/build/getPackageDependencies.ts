import IPackage from './Package';
import IDependencyList from './DependencyList';

export default (appPackage: IPackage): IDependencyList => {
    return { ...appPackage.dependencies, ...appPackage.devDependencies };
}