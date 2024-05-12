import type { Configuration } from 'webpack';
import path from 'path';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      "@": [path.resolve(__dirname, './src')],
      "@minterm/types": [path.resolve(__dirname, './src/renderer/types/index.ts')],
      "@minterm/services": [path.resolve(__dirname, './src/services/index.ts')],
    }
  },
};
