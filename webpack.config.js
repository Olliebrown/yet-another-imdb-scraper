const path = require('path') // import path from 'path'
const nodeExternals = require('webpack-node-externals')

// Export a function that will receive command line args and return
// the webpack config object.
module.exports = (env, argv) => {
  const config = {
    // Setup to run in node with all node_modules deps as externals
    target: 'node',
    externals: [nodeExternals()],

    // Main code entry point
    entry: {
      yais: path.join(__dirname, 'index.js')
    },

    // Bundled output
    output: {
      filename: '[name].min.js',
      path: path.join(__dirname, 'dist')
    },

    // Rules for processing all included files
    module: {
      rules: [{
        // JS: Transpiles with Babel to legacy JavaScript
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-async-to-generator']
          }
        }
      }]
    },

    node: {
      fs: 'empty'
    }
  }

  // Add minification of files when in production mode
  if (argv.mode === 'production') {
    config.module.rules[0].use.options.presets.push('minify')
  }

  // Return the final webpack configuration
  return config
}
