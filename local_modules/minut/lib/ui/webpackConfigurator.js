const path = require('path');

/* eslint-disable */
// disabling dependency errors because this file is a template for your project
const ManifestPlugin = require('webpack-manifest-plugin')
const NotifierPlugin = require('webpack-notifier');
const { VueLoaderPlugin } = require('vue-loader')
/* eslint-enable */

const path2jsDist = path.join(__dirname, '../../../../gui/web/dist/js');

module.exports = function (entries) {
    return {
        mode: "production",
        entry: entries,
        output: {
            filename: '[name].[chunkhash].js',
            path: path2jsDist,
        },
        module: {
            rules: [
                {
                    // required for framework:
                    test: /minut\/lib\/ui\/autoComponentRenderer.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: [['wildcard', { noModifyCase: true, exts: ["js", "es6", "es", "jsx", "vue", "javascript"] }]],
                            presets: ['@babel/preset-react'],
                        },
                    },
                },

                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        /*
                                        Assuming Chrome (V8 engine). If you want to target older browsers adjust here
                                        and import specific polyfills needed in your bundles (or entire @babel/polyfill)
                                        */
                                        targets: {
                                            node: "current",
                                        },
                                    },
                                ],
                            ],
                        },
                    },
                },

                {
                    test: /\.jsx$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                        },
                    },
                },

                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-typescript'],
                        },
                    },
                },

                {
                    test: /\.tsx$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react', '@babel/preset-typescript'],
                        },
                    },
                },

                {
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "vue-loader",
                    },
                },
            ],
        },

        resolve: {
            alias: {
                vue$: "vue/dist/vue.esm.js",
            },
        },

        plugins: [
            new ManifestPlugin(),
            new NotifierPlugin(),
            new VueLoaderPlugin(),
        ],
    };
};
