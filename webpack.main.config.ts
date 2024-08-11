import type { Configuration } from 'webpack';
import path from 'path';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json', '.scss', '.sass'],
    alias: {
      "@": [path.resolve(__dirname, './src')],
      "@minterm/types": [path.resolve(__dirname, './src/renderer/types/index.ts')],
      "@minterm/services": [path.resolve(__dirname, './src/services/index.ts')],
    }
  },
  externals: ['serialport']
};
