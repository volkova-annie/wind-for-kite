const path = require('path');

module.exports = {
  entry: {
    app: './polling.js'
  },
  output: {
    filename: '[name].js',
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
