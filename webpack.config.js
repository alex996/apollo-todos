module.exports = (env, { mode }) => ({
  entry: './src/client',
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  devtool: mode === 'development' ? 'source-map' : false
})
