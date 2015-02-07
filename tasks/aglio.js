'use strict';

var path = require('path');
var when = require('when');

module.exports = function (grunt) {
  var _ = require('underscore');
  var aglio = require('aglio');
  grunt.registerMultiTask('aglio', 'Grunt plugin to generate aglio documentation', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      separator: "",
      theme: "default",
      filter: function (src) {
        return src;
      }
    });

    var files = this.files;

    // wrap in object so we can update template by reference if custom
    var aglioOptions = {
      template: options.theme,
      includePath: options.includePath
    };

    // Make sure that the given theme exists
    aglio.getTemplates(function (err, names) {
      if (err) {
        grunt.log.warn(err);
      }
      if (!_.contains(names, aglioOptions.template)) {
        // Is a custom theme file presented
        aglioOptions.template = path.resolve(aglioOptions.template) + '.jade';
        if (!grunt.file.exists(aglioOptions.template)) {
          grunt.log.warn(aglioOptions.template + " theme does not exist, reverting to the default theme");
          aglioOptions.template = "default";
        }
      }
      // Compile must happen after the template is verified in the callback
      compile();
    });

    var getLineNo = function(input, err) {
      if (err.location && err.location.length) {
        return input.substr(0, err.location[0].index).split('\n').length;
      }
    };

    var logWarnings = function(warnings) {
      var lineNo, warning, _i, _len, _ref, _results;
      _ref = warnings || [];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        warning = _ref[_i];
        lineNo = getLineNo(warnings.input, warning) || 0;
        _results.push(grunt.log.error("Line " + lineNo + ": " + warning.message + " (warning code " + warning.code + ")"));
      }
      return _results;
    };

    function compile() {
      return when.all(when.map(files, function (f) {
        var concattedSrc = f.src.filter(function (path) {
          if (!grunt.file.exists(path)) {
            grunt.log.warn(path + " does not exist");
            return false;
          } else {
            return true;
          }
        }).map(function (path) {
          return grunt.file.read(path);
        }).join(options.separator);
        return when.promise(function (resolve, reject) {
          aglio.render(options.filter(concattedSrc), aglioOptions, function (err, html, warnings) {
            var lineNo;

            if (err) {
              lineNo = getLineNo(err.input, err);
              if (lineNo != null) {
                grunt.log.error("Line " + lineNo + ": " + err.message + " (error code " + err.code + ")");
              } else {
                grunt.log.error(JSON.stringify(err));
              }
              return done(err);
            }

            logWarnings(warnings);

            if (typeof html == 'string') {
              grunt.file.write(f.dest, html);
              grunt.log.ok("Written to " + f.dest);
              resolve(true);
            } else {
              reject({ error: err, warnings: warnings });
            }
          });
        });
      })).then(done) // Don't call done until ALL the files have completed rendering
        .catch(function (err) {
          grunt.fail.fatal("Code:" + err.code + '\n' + "Message:" + err.err, err.warnings);
        });
    }
  });
};