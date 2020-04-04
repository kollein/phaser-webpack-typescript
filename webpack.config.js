const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
  context: ROOT,

  entry: {
    'main': './main.ts'
  },

  output: {
    filename: '[name].bundle.js',
    path: DESTINATION
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      ROOT,
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader'
      },
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'tslint-loader'
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: 'ts-loader'
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml|json)$/i,
        use: "file-loader"
      },
      {
        test: [/\.vert$/, /\.json$/],
        use: "raw-loader"
      },
    ]
  },

  devtool: 'cheap-module-source-map',
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(DESTINATION)
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
  ],
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'src'),
    port: 9000
  },
};

