import * as path from 'path';

const reactHotLoaderBabel = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'node_modules',
    'react-hot-loader/babel'
);

const babelLoader = path.resolve(__dirname, '..', '..', '..', 'node_modules', 'babel-loader');
const presetEnv = path.resolve(__dirname, '..', '..', '..', 'node_modules', '@babel/preset-env');
const presetTypeScript = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'node_modules',
    '@babel/preset-typescript'
);
const presetReact = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'node_modules',
    '@babel/preset-react'
);

export default {
    loader: babelLoader,
    options: {
        plugins: [reactHotLoaderBabel],
        presets: [
            [
                presetEnv,
                {
                    loose: false,
                    modules: false,
                    targets: {
                        chrome: '70',
                        ie: '11',
                    },
                },
            ],
            presetTypeScript,
            presetReact,
        ],
    },
};
