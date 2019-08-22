import webpack from 'webpack';

export default (filename = 'app.bundle.js', path?: string): webpack.Configuration => ({
    output: {
        filename,
        path,
        publicPath: '/',
    },
});
