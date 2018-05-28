module.exports = function( grunt ) {

 	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        concat: {
      		options: {
        		separator: '\n\n',
				banner: '/**\n * <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
			            '\n * Description: Velocity is a JavaScript library which provide utilities, ui components and MVC framework implementation.' +
			            '\n * License: <%= pkg.license %>' +
			            '\n * Author: <%= pkg.author %>' +
			            '\n */\n\n'
      		},
      		dist: {
        		src: [ 'src/core/main.js', 'src/core/utils/main.js',
						'src/core/utils/**/*.js',
						'src/components/**/*.js',
						'src/mvc/core.js', 'src/mvc/application.js', 'src/mvc/controllers/main.js', 'src/mvc/utils/main.js',
						'src/mvc/controllers/BaseController.js', 'src/mvc/controllers/**/*.js',
						'src/mvc/utils/**/*.js'
					],
        		dest: 'dist/velocity.js'
      		}
    	},
    	uglify: {
			options: {
				banner: '/**\n * <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
			            '\n * Description: Velocity is a JavaScript library which provide utilities, ui components and MVC framework implementation.' +
			            '\n * License: <%= pkg.license %>' +
			            '\n * Author: <%= pkg.author %>' +
			            '\n */\n\n'
			},
      		main_target: {
	        	files: {
	          		'dist/velocity.min.js': [ 'dist/velocity.js' ]
	        	}
      		}
    	}
    });

    grunt.registerTask( 'default', [ 'concat', 'uglify' ] );
};
