import babelLoader from './babel-loader';

export default {
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.js$/,
                use: [babelLoader],
            },
        ],
    },
};
