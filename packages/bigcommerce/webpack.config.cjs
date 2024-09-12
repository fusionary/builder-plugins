// contents of webpack.config.js
const path = require('path')
const pkg = require('./package.json')

module.exports = {
  entry: `./src/${pkg.entry}`,
  externals: {
    '@builder.io/react': '@builder.io/react',
    '@builder.io/app-context': '@builder.io/app-context',
    '@emotion/core': '@emotion/core',
    react: 'react',
    'react-dom': 'react-dom',
    '@material-ui/core': '@material-ui/core',
    mobx: 'mobx',
    'mobx-react': 'mobx-react',
    '@builder.io/sdk': '@builder.io/sdk',
  },
  output: {
    filename: pkg.output,
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 1268,
    static: {
      directory: path.join(__dirname, './dist'),
    },
    headers: {
      'Access-Control-Allow-Private-Network': 'true',
      'Access-Control-Allow-Origin': '*',
    },
  },
}
