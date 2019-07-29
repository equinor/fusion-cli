import babelLoader from './babel-loader';

export default {
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.jsx?$/,
                use: [babelLoader],
            },
        ],
    },
};
