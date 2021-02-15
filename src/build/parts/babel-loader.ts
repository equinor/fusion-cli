import resolveCliDependency from '../resolveCliDependency';

const reactHotLoaderBabel = resolveCliDependency('react-hot-loader/babel');

const babelLoader = resolveCliDependency('babel-loader');
const presetEnv = resolveCliDependency('@babel/preset-env');
const presetTypeScript = resolveCliDependency('@babel/preset-typescript');
const presetReact = resolveCliDependency('@babel/preset-react');

export default {
    loader: babelLoader,
    options: {
        plugins: [reactHotLoaderBabel],
        presets: [
            presetEnv,
            presetTypeScript,
            [
                presetReact,
                {
                    runtime: "automatic"
                }
            ]
        ],
    },
};
