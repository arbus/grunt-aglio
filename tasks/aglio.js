'use strict';

var path = require('path');

module.exports = function(grunt) {
  var _ = grunt.util._, aglio = require('aglio');
  grunt.registerMultiTask('aglio', 'Grunt plugin to generate aglio documentation', function() {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      separator: "",
      theme: "default",
      filter: function(src){
        return src;
      }
    });

    var files = this.files;

    // wrap in object so we can update template by reference if custom
    var aglioOptions = {
      template: options.theme
    };

    // Make sure that the given theme exists
    aglio.getTemplates(function (err, names) {
      if(err){
        grunt.log.warn(err);
      }
      if(!_.contains(names, aglioOptions.template)){
        // Is a custom theme file presented
        aglioOptions.template = path.resolve(aglioOptions.template) + '.jade';
        if(!grunt.file.exists(aglioOptions.template)) {
          grunt.log.warn(aglioOptions.template+" theme does not exist, reverting to the default theme");
          aglioOptions.template = "default";
        }
      }
      // Compile must happen after the template is verified in the callback
      compile();
    });

    var compile = function () {
      files.forEach(function(f){
        var concattedSrc = f.src.filter(function(path){
          if(!grunt.file.exists(path)){
            grunt.log.warn(path + " does not exist");
            return false;
          }else{
            return true;
          }
        }).map(function(path){
          return grunt.file.read(path);
        }).join(options.separator);
        aglio.render(options.filter(concattedSrc), aglioOptions, function (err, html) {
          if(err){
            grunt.fail.fatal("Code:"+err.code+'\n'+"Message:"+err.message);
          }
          grunt.file.write(f.dest, html);
          grunt.log.ok("Written to " + f.dest);
          done();
        });
      });
    };
  });
};
