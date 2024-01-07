const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.ts', // Punto de entrada de tu librería
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'demos'), // Directorio que contiene tus demos
        },
        port: 3000, // Puedes elegir el puerto que prefieras
    },
    output: {
        filename: 'ddw2.library.js',
        path: path.resolve(__dirname, 'build'),
        library: 'DDW2',
        publicPath: '/build/', // Ruta pública para acceder a los assets desde el servidor
    },
    mode: 'development'
};
