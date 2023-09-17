import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import Hurx from "../hurx"
import path from "path"
import webpack from "webpack"
import webpackDevServer from "webpack-dev-server"
import HtmlWebpackPlugin from "html-webpack-plugin"

export default (projectPath: string, hurx: Hurx) => ({
    mode: 'production',
    entry: {
        main: [path.join(projectPath, 'src', 'app.tsx')]
    },
    output: {
        path: path.resolve(projectPath, 'public'),
        filename: 'bundle.min.js',
    },
    devServer: {
        static: {
            directory: path.join(projectPath, 'public')
        },
        compress: true,
        port: 9000,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.(ts(x)?)$/i,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    },
                    {
                        loader: path.join(projectPath, 'node_modules', '@hurx', 'core', 'src', 'library', 'framework', 'frontend', 'webpack', 'loaders', 'tsx-loader.ts')
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.svg$/i,
                use: [
                    {
                        loader: path.join(projectPath, 'node_modules', '@hurx', 'core', 'src', 'library', 'framework', 'frontend', 'webpack', 'loaders', 'tsx-loader.ts')
                    },
                    {
                        loader: path.join(projectPath, 'node_modules', '@hurx', 'core', 'src', 'library', 'framework', 'frontend', 'webpack', 'loaders', 'svg', 'svg-loader.ts')
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/images/[name].[ext]', // Output path for images
                            outputPath: './', // Output directory (relative to output.path)
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /^jsdom$/,
            path.join(projectPath, 'node_modules', '@hurx', 'core', 'src', 'library', 'framework', 'frontend', 'webpack', 'mocks', 'jsdom.mock.ts')
        ),
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
            // Include polyfills for Node.js core modules
            // TODO: they dont work
            buffer: require.resolve('buffer/'),
            util: require.resolve('util/'),
            events: require.resolve('events/'),
            stream: require.resolve('stream/'),
            path: require.resolve('path/'),
            os: require.resolve('os-browserify/browser'),
            assert: require.resolve('assert/')
        },
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.join(process.cwd(), 'tsconfig.json')
            })
        ]
    },
    devtool: 'source-map'
} as webpack.Configuration & webpackDevServer.Configuration)