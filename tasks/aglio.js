'use strict';
module.exports = function(grunt) {
  var _ = grunt.util._, aglio = require('aglio');
  grunt.registerMultiTask('aglio', 'Grunt plugin to generate aglio documentation', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    
    var options = this.options({
      seperator: "",
      theme: "default"
    });

    // Make sure that the given theme exists
    aglio.getTemplates(function (err, names) {
      if(err){
        grunt.log.warn(err);
      }
      if(!_.contains(names, options.theme)){
        grunt.log.warn(options.theme+" theme does not exist, revering to the default theme");
        options.theme = "default";
      }
    });

    this.files.forEach(function(f){
      var concattedSrc = f.src.filter(function(path){
        if(!grunt.file.exists(path)){
          grunt.log.warn(path + " does not exist");
          return false;
        }else{
          return true;
        }
      }).map(function(path){
        return grunt.file.read(path);
      }).join(options.seperator);

      aglio.render(concattedSrc, options.theme, function (err, html) {
        if(err){
          grunt.fail.fatal("Code:"+err.code+'\n'+"Message:"+err.message);
        }
        grunt.file.write(f.dest, html);
        grunt.log.ok("written to " + f.dest);
      });
    });
  });
};
