module.exports = function(grunt) {
  grunt.initConfig({
    babel: {
      scripts: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.js',
          dest: 'build/'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['babel']
      }
    }
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['babel']);
};
