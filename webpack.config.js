const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: {
    app: './polling.js'
  },
  output: {
    filename: 'polling.js',
    path: path.resolve(__dirname, 'static')
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
    ]
  }
};

//if (process.env.NODE_ENV === 'production') {
//  module.exports.devtool = '#source-map'
//  module.exports.plugins = (module.exports.plugins || []).concat([
//    new webpack.DefinePlugin({
//      'process.env': {
//        NODE_ENV: '"production"'
//      }
//    })
//  ])
//}
