import * as presetEnv from '@babel/preset-env';
import * as presetReact from '@babel/preset-react';

// const reactHotLoader = require(path.resolve(
//     __dirname,
//     '..',
//     '..',
//     '..',
//     '..',
//     'node_modules',
//     'react-hot-loader',
//     'babel'
// ));

export default {
    loader: 'babel-loader',
    options: {
        plugins: ['react-hot-loader'],
        presets: [
            [
                presetEnv.default,
                {
                    loose: false,
                    modules: false,
                    targets: {
                        chrome: '70',
                        ie: '11',
                    },
                },
            ],
            presetReact.default,
        ],
    },
};
