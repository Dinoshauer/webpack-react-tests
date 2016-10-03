'use strict';
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');
const autoprefixer = require('autoprefixer');

exports.devServer = (options) => {
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',
      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port, // Defaults to 8080,
      // Proxy any requests to /api to another host
      proxy: {
        '/api': {
          target: 'http://jsonplaceholder.typicode.com/',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          },
          bypass: (req) => {
            if (req.url === '/api/nope') {
              return '/bypass.html';
            }
          }
        }
      }
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };
};

exports.notifier = () => {
  return {
    plugins: [
      new WebpackNotifierPlugin()
    ]
  };
};

exports.setupCSS = (paths) => {
  return {
    module: {
      loaders: [
        {
          test: /\.s?css$/,
          loaders: ['style', 'css', 'sass', 'postcss-loader'],
          include: paths
        }
      ]
    },
    postcss: () => [autoprefixer]
  };
};

exports.extractCSS = (paths) => {
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.s?css$/,
          loader: ExtractTextPlugin.extract('style', 'css!sass!postcss-loader'),
          include: paths
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[chunkhash].[name].css'),
      new webpack.optimize.DedupePlugin()
    ],
    postcss: () => [autoprefixer]
  };
};

exports.purifyCSS = (paths) => {
  return {
    plugins: [
      new PurifyCSSPlugin({
        basePath: process.cwd(),
        // `paths` is used to point PurifyCSS to files not
        // visible to Webpack. You can pass glob patterns
        // to it.
        paths: paths
      }),
    ]
  };
};

exports.minify = (warnings = false) => {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: warnings
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        // Don't beautify output (enable for neater output)
        beautify: false,
        // Eliminate comments
        comments: true,
        // Compression specific options
        compress: {
          warnings: false,
          // Drop `console` statements
          drop_console: true
        },
        // Mangling specific options
        mangle: {
          // Don't mangle $
          except: ['$'],
          // Don't care about IE8
          screw_ie8: true,
          // Don't mangle function names
          keep_fnames: true
        },
        except: ['webpackJsonp']
      })
    ]
  };
};

exports.setFreeVariable = (key, value) => {
  return {
    plugins: [
      new webpack.DefinePlugin({ [key]: JSON.stringify(value) })
    ]
  };
};

exports.extractBundle = (options) => {
  return {
    // Define an entry point needed for splitting.
    entry: {
      [options.name]: options.entries
    },
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest']
      })
    ]
  };
};

exports.clean = (path = 'root') => {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
      })
    ]
  };
};
