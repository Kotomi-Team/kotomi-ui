/* eslint-disable no-undef */
const path = require('path');

module.exports = {
    mode: "production",
    devtool: "source-map",
    entry: {
        app: './lib/index.js',
    },
    output: {
        filename: 'kotomi.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: [{
                loader: 'css-loader',
              },
              {
                loader: 'less-loader',
                options: {
                  strictMath: true,
                  noIeCompat: true,
                },
              },
            ],
          },{
            test: /\.css$/i,
            use: [{
              loader: 'css-loader',
              options: {
                esModule: true
              },
            }],
          },{
            enforce: "pre",
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "source-map-loader"
        }]
    },
    resolve: {
        extensions: [".js", ".jsx",".less"]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "antd": "Ant.Design",
        "xlsx": "js-xlsx",
    }
};