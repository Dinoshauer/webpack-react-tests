'use strict';
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const pkg = require('./package.json');

const parts = require('./libs/parts');

const PATHS = {
  src: path.join(__dirname, 'app', 'src'),
  styles: [
    path.join(__dirname, 'app', 'styles', 'main.scss')
  ],
  fonts: [
    path.join(__dirname, 'app', 'assets', 'fonts')
  ],
  images: [
    path.join(__dirname, 'app', 'assets', 'images')
  ],
  build: path.join(__dirname, 'build')
};

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    style: PATHS.styles.concat([
      'webpack-dev-server/client?http://localhost:3005',
      'webpack/hot/only-dev-server'
    ]),
    app: [
      PATHS.src,
      'webpack-dev-server/client?http://localhost:3005',
      'webpack/hot/only-dev-server'
    ],
    vendor: Object.keys(pkg.dependencies)
  },
  output: {
    publicPath: '/build/',
    path: PATHS.build,
    filename: '[name].js'
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     title: 'Webpack demo'
  //   })
  // ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel?cacheDirectory'],
        exclude: /node_modules/,
        include: PATHS.app
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url?limit=25000',
        include: PATHS.images
      },
      {
        test: /\.svg$/,
        loader: 'file',
        include: PATHS.images
      },
      {
        test: /\.woff$/,
        // Inline small woff files and output them below font/.
        // Set mimetype just in case.
        loader: 'url',
        query: {
          name: 'font/[hash].[ext]',
          limit: 5000,
          mimetype: 'application/font-woff'
        },
        include: PATHS.fonts
      },
      {
        test: /\.ttf$|\.eot$/,
        loader: 'file',
        query: {
          name: 'font/[hash].[ext]'
        },
        include: PATHS.fonts
      }
    ]
  }
};

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

let config;

// Detect how npm is run and branch based on that
switch (TARGET) {
  case 'build':
  case 'stats':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          // Tweak this to match your GitHub project name
          publicPath: '/webpack-demo/',
          filename: '[chunkhash].[name].js',
          // This is used for require.ensure. The setup
          // will work without but this is useful to set.
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.extractCSS(PATHS.styles),
      parts.purifyCSS(PATHS.styles),
      parts.minify(),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      )
      // ),
      // parts.extractBundle({
      //   name: 'vendor',
      //   entries: ['react']
      // })
    );
    break;
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map'
      },
      parts.notifier(),
      parts.setupCSS(PATHS.styles),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      }),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'development'
      )
    );
}

module.exports = validate(config);
