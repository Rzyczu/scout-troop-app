const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('webpack-dev-server');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './src/app.js', // Globalne funkcje dla wszystkich stron
        login: './src/modules/auth/login.js', // Funkcje tylko dla login.html
        dashboard: './src/modules/dashboard/dashboard.js', // Funkcje tylko dla dashboard.html
        users: './src/modules/users/users.js', // Funkcje tylko dla users.html
        members: './src/modules/members/members.js', // Funkcje tylko dla users.html
        members: './src/modules/members/members.js', // Funkcje tylko dla users.html
        troops: './src/modules/troops/troops.js', // Funkcje tylko dla troops.html
        troop: './src/modules/troop/troop.js', // Funkcje tylko dla troop.html
    },
    output: {
        filename: '[name].bundle.js', // Oddzielne bundlowanie per moduł
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/', // Dodaje poprawne ścieżki w wygenerowanym HTML
        clean: true, // Czyści katalog `dist` przed kompilacją
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
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
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/components/navbar.html'), // Skąd kopiujemy
                    to: path.resolve(__dirname, 'dist/components'), // Dokąd kopiujemy
                },
                {
                    from: path.resolve(__dirname, 'src/components/table/table.html'),
                    to: path.resolve(__dirname, 'dist/components')
                },

            ],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css', // Tworzy osobne pliki CSS dla każdego entry pointa
            chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['app'], // Ładuje tylko app.bundle.js
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/modules/auth/login.html',
            chunks: ['login'], // Ładuje login.bundle.js
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
        new HtmlWebpackPlugin({
            template: './src/modules/members/members.html',
            chunks: ['members', 'app'], // Ładuje members.bundle.js i app.bundle.js
            filename: 'members.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/modules/troops/troops.html',
            chunks: ['troops', 'app'], // Ładuje troops.bundle.js i app.bundle.js
            filename: 'troops.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/modules/troop/troop.html',
            chunks: ['troop', 'app'], // Ładuje troop.bundle.js i app.bundle.js
            filename: 'troop.html',
        }),
    ],
    mode: process.env.NODE_ENV || 'development',
    devtool: 'source-map',
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 3000, // Port Webpack Dev Server
        hot: true, // Hot Module Replacement
        open: true,
        proxy: [
            {
                context: ['/'], // Wszystkie żądania zaczynające się od /
                target: 'http://localhost:5000', // Backend na porcie 5000
                secure: false, // Jeśli używasz HTTP, a nie HTTPS
                changeOrigin: true, // Dostosowuje nagłówki do backendu
            },
        ],
        client: false,
        watchFiles: ['./src/**/*'], // Śledzenie wszystkich plików w folderze src
        devMiddleware: {
            writeToDisk: true, // Write files to `dist` during development
        },
    },
};
