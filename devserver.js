const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3005, '0.0.0.0', function (err, result) {
  if (err) throw err;

  console.log('webpack-dev-server listening on port 3005 🚀');
});
