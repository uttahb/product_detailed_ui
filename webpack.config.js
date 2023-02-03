
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'
// import { MFLiveReloadPlugin } from "@module-federation/fmr"

const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin

import { env } from '@appblocks/node-sdk'
env.init()

const __dirname = path.resolve()

export default {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 4008,
  },
  externals: {
    env: JSON.stringify(process.env),
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
      {
        test: /.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /.m?js/,
        type: 'javascript/auto',
      },
      {
        test: /.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /.(jpg|png|svg)$/,
        use: {
          loader: "url-loader",
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }), 
    // new MFLiveReloadPlugin({
    //   port: 4001, // the port your app runs on
    //   container: "Container", // the name of your app, must be unique
    //   // standalone: false, // false uses chrome extention
    // }),
    new ModuleFederationPlugin({
      name: 'product_detailed_ui',
      filename: 'remoteEntry.js',
      exposes: {
        './product_detailed_ui': './src/product_detailed_ui',
      },
      shared: {
        react: {
          import: 'react', // the "react" package will be used a provided and fallback module
          shareKey: 'react', // under this name the shared module will be placed in the share scope
          shareScope: 'default', // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
          version: '^17.0.2',
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}
