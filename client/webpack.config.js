const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/, },
      { test: /\.css?$/i, use: ['style-loader', 'css-loader'], exclude: /node_modules/, },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
        "common": path.resolve(__dirname, "../common/")
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: path.resolve(__dirname, "./src/index.html"),
      inject: "body"
    }),
  ],
  output: {
    filename: 'df-client.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
};