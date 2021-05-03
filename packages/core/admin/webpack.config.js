'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const isWsl = require('is-wsl');
const alias = require('./webpack.alias.js');

// TODO: remove
const URLs = {
  mode: 'host',
};

module.exports = ({
  useEE,
  entry,
  dest,
  env,
  optimize,
  options = {
    backend: 'http://localhost:1337',
    publicPath: '/admin/',
    features: [],
  },
}) => {
  const isProduction = env === 'production';

  const webpackPlugins = isProduction
    ? [
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        }),
        new MiniCssExtractPlugin({
          filename: '[name].[chunkhash].css',
          chunkFilename: '[name].[chunkhash].chunkhash.css',
          ignoreOrder: true,
        }),
        new WebpackBar(),
      ]
    : [];

  return {
    mode: isProduction ? 'production' : 'development',
    bail: isProduction ? true : false,
    devtool: false,
    entry,
    output: {
      path: dest,
      publicPath: options.publicPath,
      // Utilize long-term caching by adding content hashes (not compilation hashes)
      // to compiled assets for production
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].bundle.js',
      chunkFilename: isProduction ? '[name].[contenthash:8].chunk.js' : '[name].chunk.js',
    },
    optimization: {
      minimize: optimize,
      minimizer: [
        // Copied from react-scripts
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: !isWsl,
          // Enable file caching
          cache: true,
          sourceMap: false,
        }),
      ],
      runtimeChunk: true,
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: isProduction,
              compact: isProduction,
              presets: [
                require.resolve('@babel/preset-env'),
                require.resolve('@babel/preset-react'),
              ],
              plugins: [
                require.resolve('@babel/plugin-proposal-class-properties'),
                require.resolve('@babel/plugin-syntax-dynamic-import'),
                require.resolve('@babel/plugin-transform-modules-commonjs'),
                require.resolve('@babel/plugin-proposal-async-generator-functions'),
                [
                  require.resolve('@babel/plugin-transform-runtime'),
                  {
                    helpers: true,
                    regenerator: true,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(svg|eot|otf|ttf|woff|woff2)$/,
          use: 'file-loader',
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 1000,
          },
        },
        {
          test: /\.html$/,
          include: [path.join(__dirname, 'src')],
          use: require.resolve('html-loader'),
        },
        {
          test: /\.(mp4|webm)$/,
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
          },
        },
      ],
    },
    resolve: {
      alias,
      symlinks: false,
      extensions: ['.js', '.jsx', '.react.js'],
      mainFields: ['browser', 'jsnext:main', 'main'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, 'index.html'),
        // FIXME
        // favicon: path.resolve(__dirname, 'admin/src/favicon.ico'),
      }),
      // FIXME: some variables are not needed anymore
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
        REMOTE_URL: JSON.stringify(options.publicPath),
        BACKEND_URL: JSON.stringify(options.backend),
        MODE: JSON.stringify(URLs.mode), // Allow us to define the public path for the plugins assets.
        PUBLIC_PATH: JSON.stringify(options.publicPath),
        PROJECT_TYPE: JSON.stringify(useEE ? 'Enterprise' : 'Community'),
        ENABLED_EE_FEATURES: JSON.stringify(options.features),
      }),
      new webpack.NormalModuleReplacementPlugin(/ee_else_ce(\.*)/, function(resource) {
        let wantedPath = path.join(
          resource.context.substr(0, resource.context.lastIndexOf(`${path.sep}src${path.sep}`)),
          'src'
        );

        if (useEE) {
          resource.request = resource.request.replace(
            /ee_else_ce/,
            path.join(wantedPath, '../..', 'ee/admin')
          );
        } else {
          resource.request = resource.request.replace(/ee_else_ce/, path.join(wantedPath));
        }
      }),
      new NodePolyfillPlugin(),
      ...webpackPlugins,
    ],
  };
};
