const fs = require('fs');
const path = require('path');

module.exports = function(grunt) {
  // Get list of js files in lib dir
  const srcFiles = fs.readdirSync(path.join(__dirname, 'src'))
    .filter(dirname => dirname.endsWith('.js'))

  // Make key->value object of JS files for babel
  const jsFiles = { 'build/index.js': 'index.js' }
  srcFiles.forEach((filename) => {
    jsFiles[`build/src/${filename}`] = `src/${filename}`
  })

  // Make array of JS files for Uglify
  const gruntFiles = []
  for (let file in jsFiles) {
    gruntFiles.push(file)
  }

  // Setup grunt and configure pre-defined tasks
  grunt.initConfig({
    // Configure the babel translation task
    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-async-to-generator']
      },
      dist: {
        files: jsFiles
      }
    },

    // Configure uglify concat, compress, and mangle task
    uglify: {
      yais: {
        files: {
          'dist/yais.min.js': gruntFiles
        }
      }
    }
  });
  
  // Load and register tasks
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['babel', 'uglify']);
};
