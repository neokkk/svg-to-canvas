import path from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';

const config: Configuration = {
  mode: 'production',
  entry: './main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
};

export default config;
