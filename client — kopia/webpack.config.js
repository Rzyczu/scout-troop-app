const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/app.js', // Globalne funkcje dla wszystkich stron
        login: './src/modules/auth/login.js', // Funkcje tylko dla login.html
        dashboard: './src/modules/dashboard/dashboard.js', // Funkcje tylko dla dashboard.html
        users: './src/modules/users/users.js', // Funkcje tylko dla users.html
    },
    output: {
        filename: '[name].bundle.js', // Oddzielne bundlowanie per moduł
        path: path.resolve(__dirname, 'dist'),
        clean: true, // Czyści katalog `dist` przed kompilacją
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css', // Plik CSS per moduł
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['app'], // Ładuje tylko app.bundle.js
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/modules/auth/login.html',
            chunks: ['login', 'app'], // Ładuje login.bundle.js i app.bundle.js
            filename: 'login.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/modules/dashboard/dashboard.html',
            chunks: ['dashboard', 'app'], // Ładuje dashboard.bundle.js i app.bundle.js
            filename: 'dashboard.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/modules/users/users.html',
            chunks: ['users', 'app'], // Ładuje users.bundle.js i app.bundle.js
            filename: 'users.html',
        }),
    ],
    mode: 'development',
    devtool: 'source-map',
};
