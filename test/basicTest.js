var assert = require('assert');
var fs = require('fs');
var grunt = require('grunt');
var path = require('path');

var output = path.resolve('./', 'test/api.html');

describe('grunt aglio', function(){
	this.timeout(5000);

	function resetTempFiles(callback){
		if(fs.existsSync(output)){
			fs.unlinkSync(output);
		}
		// Get rid of the multiple md files
		var filesToDelete = fs.readdirSync(path.resolve('./', 'test')).filter(function(filename){
			var parts = filename.split('.');
			return (parts[parts.length - 1] === 'md' && parts[0] !== 'sample') || parts[parts.length - 1] === 'html';
		});
		for(var i = 0; i < filesToDelete.length; i++){
			fs.unlinkSync(path.resolve('./', 'test/'+filesToDelete[i]));
		}

		callback();
	}

	before(function(done){
		grunt.task.loadTasks('tasks');
		assert(grunt.task.exists('aglio'));
		resetTempFiles(done);
	});

	beforeEach(function(){
		grunt.task.clearQueue();
	});

	it('should do a basic run', function(done){
		var configObj = {};
		configObj[output] = [path.resolve('./', 'test/sample.md')];
		grunt.config('aglio.test.files', configObj);
		grunt.task.run('aglio');
		grunt.task.start();

		setTimeout(function(){
			fs.exists(output, function(exists){
				assert(exists);
				resetTempFiles(done);
			})
		}, 1000);

	});

	it('should be able to combine a large number of files together', function(done){
		// Split out sample.md into multiple small files
		var sampleFile = fs.readFileSync(path.resolve('./', 'test/sample.md'), {
			encoding: 'utf8'
		}).split("\n");

		var destFiles = [];
		for(var i = 0; i < sampleFile.length; i++){
			fs.writeFileSync(path.resolve('./', 'test/'+i+'.md'), sampleFile[i]);
			destFiles.push(path.resolve('./', 'test/'+i+'.md'));
		}

		var configObj = {};
		configObj[output] = destFiles;
		grunt.config('aglio.test.files', configObj);
		grunt.config('aglio.test.options.separator', grunt.util.linefeed);
		grunt.task.run('aglio');
		grunt.task.start();

		setTimeout(function(){
			fs.exists(output, function(exists){
				assert(exists);
				resetTempFiles(done)
			})
		}, 1000);
	});

  it('should use a custom jade template', function (done) {
    var configObj = {};
    configObj[output] = [path.resolve('./', 'test/sample.md')];
    grunt.config('aglio.test.files', configObj);
    grunt.config('aglio.test.options.theme', './node_modules/aglio/templates/slate');
    grunt.task.run('aglio');
    grunt.task.start();

    setTimeout(function(){
      fs.exists(output, function(exists){
        assert(exists);
        // Make sure that it used the slate theme
        var contents = fs.readFileSync(output, 'utf8');
        assert(contents.indexOf('//netdna.bootstrapcdn.com/bootswatch/3.1.1/slate/bootstrap.min.css') > -1);
        resetTempFiles(done);
      })
    }, 1000);
  });

  it('should be able to create multiple output files', function(done){
    // Split out sample.md into multiple small files
    var sampleFile = fs.readFileSync(path.resolve('./', 'test/sample.md'), {
      encoding: 'utf8'
    }).split("\n");

    var destFiles = [];
    for(var i = 0; i < sampleFile.length; i++){
      fs.writeFileSync(path.resolve('./', 'test/'+i+'.md'), sampleFile[i]);
      destFiles.push(path.resolve('./', 'test/'+i+'.md'));
    }

    var configObj = {};
    var configObj2 = {};
    var configObj3 = {};
    var configObj4 = {};
    var configObj5 = {};
    var output2 = output.substr(0, output.length - 4) + '2.html';
    var output3 = output.substr(0, output.length - 4) + '3.html';
    var output4 = output.substr(0, output.length - 4) + '4.html';
    var output5 = output.substr(0, output.length - 4) + '5.html';
    configObj[output2] = path.resolve('./', 'test/sample.md');
    configObj[output] = destFiles;
    configObj2[output2] = path.resolve('./', 'test/sample.md');
    configObj3[output3] = path.resolve('./', 'test/sample.md');
    configObj4[output4] = path.resolve('./', 'test/sample.md');
    configObj5[output5] = path.resolve('./', 'test/sample.md');
    grunt.config('aglio.test.files', configObj);
    grunt.config('aglio.test.options.separator', grunt.util.linefeed);
    grunt.config('aglio.test2.files', configObj2);
    grunt.config('aglio.test2.options.separator', grunt.util.linefeed);
    grunt.config('aglio.test3.files', configObj3);
    grunt.config('aglio.test3.options.separator', grunt.util.linefeed);
    grunt.config('aglio.test4.files', configObj4);
    grunt.config('aglio.test4.options.separator', grunt.util.linefeed);
    grunt.config('aglio.test5.files', configObj5);
    grunt.config('aglio.test5.options.separator', grunt.util.linefeed);
    grunt.task.run('aglio');
    grunt.task.start();

    setTimeout(function(){
      assert(fs.existsSync(output));
      assert(fs.existsSync(output2));
      assert(fs.existsSync(output3));
      assert(fs.existsSync(output4));
      assert(fs.existsSync(output5));
      resetTempFiles(done);
    }, 4000);
  });

  after(function(done){
		resetTempFiles(done);
	})
});
