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

    if (options.theme === "default") {
      // gracefully handle incorrect themeVariables value for detault theme.
      // see https://github.com/danielgtaylor/aglio/tree/olio-theme#theme-options
      // and https://github.com/danielgtaylor/aglio/tree/olio-theme/styles
      if (options.themeVariables && !_.contains(['default', 'flatly', 'slate', 'cyborg'], options.themeVariables)) {
        grunt.log.warn("Unrecognized theme variables '" + options.themeVariables + "'. Using 'default'.");
        options.themeVariables = "default";
      }

      grunt.verbose.writeln("Using olio (default) theme with theme variables '" + options.themeVariables + "'.");
  
    } else {
      // catch theme (module) require before aglio catches it; fall back to
      // default theme. incorrectly styled docs are beter than no docs at all.
      try {
        require('aglio-theme-' + options.theme);
      } catch(e) {
        options.theme = 'default';
        grunt.log.warn("Aglio custom theme '" + options.theme + "' not found. Using default theme ('oglio'). Hint: 'npm install --save aglio-theme-" + options.theme + "'");
      }

      grunt.verbose.writeln("Using custom theme '" + options.theme + "' with theme variables '" + options.themeVariables + "'.");
    }

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

    compile();

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
          aglio.render(options.filter(concattedSrc), options, function (err, html, warnings) {
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
