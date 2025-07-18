const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/index.ts"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                phaser: {
                    test: /[\\/]node_modules[\\/]phaser[\\/]/,
                    name: "phaser",
                    chunks: "all",
                },
                phasereditor2d: {
                    test: /[\\/]node_modules[\\/]@phasereditor2d[\\/]/,
                    name: "phasereditor2d",
                    chunks: "all",
                }
            }
        }
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]-[contenthash].bundle.js",
        assetModuleFilename: "asset-packs/[name]-[hash][ext][query]",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.json$/,
                type: "json",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "~": path.resolve(__dirname, "src"),
            "@core": path.resolve(__dirname, "src/core"),
            "@domain": path.resolve(__dirname, "src/core/domain"),
            "@application": path.resolve(__dirname, "src/core/application"),
            "@presentation": path.resolve(__dirname, "src/presentation"),
            "@infraestructure": path.resolve(__dirname, "src/infraestructure"),
            "@ecs": path.resolve(__dirname, "src/infraestructure/ecs"),
        },
    },
    devServer: {
        historyApiFallback: true,
        allowedHosts: 'all',
        static: {
            directory: path.resolve(__dirname, "./dist"),
        },
        open: true,
        hot: true,
        port: 8080,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src/index.html"),
    
            minify: true
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: "static",
                    globOptions: {
                        // asset pack files are imported in code as modules
                        ignore: ["**/publicroot", "**/*-pack.json"]
                    }
                }
            ]
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
};