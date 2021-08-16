import * as path from 'path';
import IPackage from '../Package';

export default (modulePackage: IPackage, isProduction: boolean) => ({
    entry: isProduction
        ? path.resolve(process.cwd(), modulePackage.main)
        : [path.resolve(process.cwd(), modulePackage.main), 'webpack-hot-middleware/client'],

    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        modules: [
            path.resolve(process.cwd(), 'node_modules'),
            path.dirname(path.resolve(process.cwd(), modulePackage.main)),
            path.resolve(__dirname, '..', '..', '..', 'node_modules'),
        ],
        fallback: { 
            path: false
        }
    },
});
