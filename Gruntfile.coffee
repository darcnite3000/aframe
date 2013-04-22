module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      glob:
        expand: true
        flatten: true
        cwd: 'lib'
        src: [
          '*.coffee'
        ]
        dest: 'lib'
        ext: '.js'
    watch:
      coffee:
        files: [
          'lib/*.coffee'
        ]
        tasks: [
          'coffee:glob'
        ]
        options:
          nospawn: true
          interupt: true
  
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-livereload'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  
  grunt.registerTask 'default', [
    'watch'
  ]