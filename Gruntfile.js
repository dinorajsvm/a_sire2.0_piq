module.exports = function ( grunt ) {
    grunt.loadNpmTasks( 'grunt-war' );

    var taskConfig = {
        war: {
            target: {
                options: {
                    war_verbose: true,
                    war_dist_folder: 'AngularArtifact',   // Folder path seperator added at runtime. 
                    war_name: 'sirepiq',      // .war will be appended if omitted 
                    webxml_welcome: 'index.html',
                    webxml_webapp_extras: ['<welcome-file-list><welcome-file>/index.html</welcome-file></welcome-file-list><error-page><location>/index.html</location></error-page>'], 
//redirect the errors pages to index.html
                    webxml_display_name: 'MTS'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/piq', //the folder where the project is located
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        }
    };

    grunt.initConfig( taskConfig );
};