module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({   
    sass: {
      dest: {
        options: {
          style: 'expanded'
        },
        files: [{
          "expand": true,
          "cwd": "src/sass/",
          "src": ["**.sass"],
          "dest": "src/css/",
          "ext": ".css"
        }]
      }
    },

    cssmin: {
  	  my_target: {
  	    files: [{
  	      expand: true,
  	      cwd: 'src/css/concate',
  	      src: ['main.css'],
  	      dest: 'dist/',
  	      ext: '.min.css'
  	    }]
  	  }
  	},

  	concat_css: {
	    options: {
	      // Task-specific options go here.
	    },
	    all: {
	      src: ["src/css/*.css"],
	      dest: "src/css/concate/main.css"
	    },
    },

    watch: {
      scripts: {
        files: ['src/sass/**.sass'],
        tasks: ['minAll']
      }
    },

    clean: ["src/css/concate", "src/js/concate"]
  });

  grunt.registerTask('default', ['sass:dest', 'concat_css:all', 'cssmin:my_target']);
  grunt.registerTask('reload', ['watch']);
}

